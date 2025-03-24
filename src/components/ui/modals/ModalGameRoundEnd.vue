<script setup lang="ts">
import type { Slot } from 'vue'
import gameRoundOverLost from '@/assets/images/game/gameRoundOverLost.svg'
import gameRoundOverWon from '@/assets/images/game/gameRoundOverWon.svg'
import GameOverlayContent from '@/components/ui/modals/ModalGameContent.vue'
import { onMounted, ref, useSlots } from 'vue'
import { useSoundStore } from '@/stores/sounds.store'

interface Props {
  result?: 'won' | 'lost'
  heading?: string
  hasCloseButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  heading: '',
  result: 'won',
  hasCloseButton: true,
})

const slots = useSlots() as {
  default?: Slot
  header?: Slot
  footerLeft?: Slot
  footerCenter?: Slot
  footerRight?: Slot
}

const soundStore = useSoundStore()

const animRef = ref<HTMLElement | null>(null)
const assetSrc = ref('')
const animIsVisible = ref(true)

onMounted(() => {
  if (props.result === 'lost') {
    assetSrc.value = gameRoundOverLost
    soundStore.playSoundEffect('gameRoundLost')
  } else {
    assetSrc.value = gameRoundOverWon
    soundStore.playSoundEffect('gameRoundOver')
  }

  setTimeout(() => {
    if (props.result === 'lost') {
      soundStore.playSoundEffect('gameLost')
    } else {
      soundStore.playSoundEffect('gameWon')
    }

    animIsVisible.value = false
  }, 1500)
})
</script>

<template>
  <img
    v-if="animIsVisible"
    ref="animRef"
    :src="assetSrc"
    width="252"
    height="252"
    class="w-64 h-64"
  >

  <GameOverlayContent
    v-else
    :heading="heading"
    :has-close-button="hasCloseButton"
  >
    <template v-if="slots.default">
      <slot />
    </template>

    <template
      v-if="slots.header"
      #header
    >
      <slot name="header" />
    </template>

    <template
      v-if="slots.footerLeft"
      #footerLeft
    >
      <slot name="footerLeft" />
    </template>

    <template
      v-if="slots.footerCenter"
      #footerCenter
    >
      <slot name="footerCenter" />
    </template>

    <template
      v-if="slots.footerRight"
      #footerRight
    >
      <slot name="footerRight" />
    </template>
  </GameOverlayContent>
</template>
