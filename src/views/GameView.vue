<script setup lang="ts">
import GameBoard from '@/components/game/ui/GameBoard.vue'
import GameBottom from '@/components/game/ui/GameBottom.vue'
import GameModal from '@/components/game/ui/GameModal.vue'
import GamePowerupBar from '@/components/game/ui/GamePowerupBar.vue'
import GamePowerupGlow from '@/components/game/ui/GamePowerupGlow.vue'
import GameTop from '@/components/game/ui/GameTop.vue'
import { useAppStore } from '@/stores/app.store'
import { useGameStore } from '@/stores/game.store'
import { useGameRoundStore } from '@/stores/gameRound.store'
import { useSoundStore } from '@/stores/sounds.store'
import { isEmptyArray } from '@/utils'
import Movinblocks from 'movinblocks'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const appStore = useAppStore()
const soundStore = useSoundStore()
const gameStore = useGameStore()
const gameRoundStore = useGameRoundStore()

function setUIAnimation() {
  new Movinblocks()
    .setTimeline(['gameTop', 'gameBottom'])
    .setAnimation(['slideInTop', 'slideInBottom'])
    .setOverlap(200)
    .setDuration(800)
    .prepare()
    .start()
}

function loadDummyData() {
  console.warn('Using debug data. Disable after testing')

  gameStore.setGameCollections([appStore.collections[1]])
  gameStore.prepareGame()
  soundStore.stopLoopSound()
  soundStore.playLoopSound('gameBg')
  gameRoundStore.prepareRound()
}

onMounted(() => {
  setUIAnimation()

  if (isEmptyArray(gameStore.gameWordsList)) {
    // TODO remove call
    loadDummyData()
    // router.push('/')
    return
  }

  soundStore.stopLoopSound()
  soundStore.playLoopSound('gameBg')
  gameRoundStore.prepareRound()
})
</script>

<template>
  <section class="relative w-full h-full">
    <GameBoard />
    <GameTop />
    <GameBottom />
    <GamePowerupBar />
    <GamePowerupGlow />
    <GameModal />
  </section>
</template>
