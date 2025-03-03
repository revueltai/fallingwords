<script setup lang="ts">
import type { Slot } from 'vue'
import GameOverlayContent from '@/components/game/overlays/GameOverlayContent.vue'
import { onMounted, ref, useSlots } from 'vue'

interface Props {
  heading?: string
  hasCloseButton?: boolean
}

withDefaults(defineProps<Props>(), {
  heading: '',
  hasCloseButton: true,
})

const slots = useSlots() as {
  default?: Slot
  header?: Slot
  footerLeft?: Slot
  footerCenter?: Slot
  footerRight?: Slot
}

const animRef = ref<HTMLElement | null>(null)
const animIsVisible = ref(true)

onMounted(() => setTimeout(() => animIsVisible.value = false, 1500))
</script>

<template>
  <img
    v-if="animIsVisible"
    ref="animRef"
    width="252"
    height="252"
    src="/images/ui/gameRoundOver.svg"
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
