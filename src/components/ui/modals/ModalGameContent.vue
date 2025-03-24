<script setup lang="ts">
import type { MbAnimation, MbCustomAnimation } from 'movinblocks'
import type { Slot } from 'vue'
import { UI } from '@/configs/constants'
import Movinblocks from 'movinblocks'
import { onMounted, useSlots } from 'vue'

interface Props {
  heading?: string
  hasCloseButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  heading: '',
  hasCloseButton: true,
})

const emit = defineEmits(['close'])

const slots = useSlots() as {
  default?: Slot
  header?: Slot
  footerLeft?: Slot
  footerCenter?: Slot
  footerRight?: Slot
}

function handleClose() {
  emit('close')
}

onMounted(() => {
  const timelineElements = [
    'modalContent',
    'modalContentHeading',
  ]

  const animations: MbAnimation[] = [
    UI.animationClasses.named.scaleIn as MbCustomAnimation,
    'slideInTop',
  ]

  if (slots.header) {
    timelineElements.push('overlayHeader')
    animations.push('fadeIn')
  }

  if (slots.header) {
    timelineElements.push('modalContentContent')
    animations.push('fadeIn')
  }

  timelineElements.push('modalContentFooter')
  animations.push('slideInBottom')

  if (props.hasCloseButton) {
    timelineElements.push('modalContentClose')
    animations.push(UI.animationClasses.named.scaleIn as MbCustomAnimation)
  }

  new Movinblocks()
    .setTimeline(timelineElements)
    .setAnimation(animations)
    .setOverlap(200)
    .setDuration(500)
    .prepare()
    .start()
})
</script>

<template>
  <div class="relative h-auto">
    <div
      id="overlayHeader"
      class="relative z-30"
    >
      <div class="pointer-events-none">
        <slot name="header" />
      </div>

      <Button
        v-if="hasCloseButton"
        id="modalContentClose"
        background-color="quaternary"
        border-color="quaternary-light"
        icon-only
        class="absolute -top-2 -right-2 z-30"
        @click="handleClose"
      >
        <Icon
          name="cross"
          size="md"
          stroke-width="4"
        />
      </Button>
    </div>

    <div
      id="modalContent"
      class="z-10 rounded-2xl shadow-2xl border border-secondary-light bg-secondary p-8 text-center overflow-hidden"
    >
      <div>
        <h2
          id="modalContentHeading"
          class="text-h5 mb-6 content__heading pointer-events-none"
        >
          {{ heading }}
        </h2>
      </div>

      <div class="flex flex-col gap-8">
        <div
          id="modalContentContent"
          class="place-items-center"
        >
          <slot />
        </div>

        <div
          id="modalContentFooter"
          class="flex items-center justify-between w-full gap-4"
        >
          <slot name="footerLeft" />

          <div class="flex items-center justify-between gap-4">
            <slot name="footerCenter" />
          </div>

          <slot name="footerRight" />
        </div>
      </div>
    </div>
  </div>
</template>
