<script setup lang="ts">
import type { MbCustomAnimation } from 'movinblocks'
import DashboardCollections from '@/components/ui/DashboardCollections.vue'
import DashboardFooter from '@/components/ui/DashboardFooter.vue'
import DashboardHeader from '@/components/ui/DashboardHeader.vue'
import ModalSettings from '@/components/ui/modals/ModalSettings.vue'
import { DASHBOARD_MENU, UI } from '@/configs/constants'
import { useAppStore } from '@/stores/app.store'
import { useGameStore } from '@/stores/game.store'
import { useModalStore } from '@/stores/modal.store'
import { useSoundStore } from '@/stores/sounds.store'
import { toastEmitter } from '@/utils/ToastEmitter'
import Movinblocks from 'movinblocks'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const soundStore = useSoundStore()
const router = useRouter()
const gameStore = useGameStore()
const appStore = useAppStore()
const modalStore = useModalStore()

const maxGameCollections = 4
const lobbyMode = ref(false)
const selectedCollections = ref<GameCollection[]>([])

function handleShowLobby() {
  lobbyMode.value = true
}

function handleShowSettings() {
  modalStore.openModal()
}

function handleShowDashboard() {
  selectedCollections.value = []
  lobbyMode.value = false
}

function handleCollectionToggling(collection: GameCollection) {
  const index = selectedCollections.value.findIndex(item => item.uid === collection.uid)

  if (index !== -1) {
    selectedCollections.value.splice(index, 1)
  } else if (selectedCollections.value.length < maxGameCollections) {
    selectedCollections.value.push(collection)
  }
}

function handleGameStart() {
  const rs = gameStore.prepareGame(selectedCollections.value)

  if (rs) {
    router.push('game')
  } else {
    toastEmitter.emit('toast', { message: 'Failed to start game', type: 'error' })
    router.push('/')
  }
}

onMounted(() => {
  soundStore.stopLoopSound()
  soundStore.playLoopSound('dashboardBg')

  const streakAnim = new Movinblocks()
    .setTimeline(Array.from({ length: 7 }, (_, i) => `streakDay${i}`))
    .setAnimation(UI.animationClasses.named.scaleIn as MbCustomAnimation)
    .setOverlap(200)
    .setDuration(300)
    .prepare()

  new Movinblocks()
    .setTimeline(['header', 'character', 'heading', 'status', 'streak', 'footer', 'list'])
    .setAnimation([
      'fadeIn',
      UI.animationClasses.named.scaleIn as MbCustomAnimation,
      'fadeIn',
      UI.animationClasses.named.scaleIn as MbCustomAnimation,
      'fadeIn',
      'revealInBottom',
      'fadeIn',
    ])
    .setOverlap(200)
    .setDuration([600, 400, 400, 400, 400, 400, 600])
    .on('animationEnd', (data) => {
      if (data.currentElement.id === 'streak') {
        streakAnim.start()
      }
    })
    .prepare()
    .start()
})
</script>

<template>
  <div class="h-full overflow-y-auto pb-32">
    <DashboardHeader
      :is-lobby="lobbyMode"
      class="mb-5"
      @show-dashboard="handleShowDashboard"
    />

    <DashboardCollections
      :is-lobby="lobbyMode"
      :collections="appStore.collections"
      :selected-collections="selectedCollections"
      @forward-collection="handleCollectionToggling"
    />
  </div>

  <DashboardFooter
    :menu-items="DASHBOARD_MENU"
    :is-lobby="lobbyMode"
    :has-selected-collections="!!selectedCollections.length"
    @show-lobby="handleShowLobby"
    @show-settings="handleShowSettings"
    @start-game="handleGameStart"
  />

  <Modal heading="Settings">
    <ModalSettings />
  </Modal>
</template>
