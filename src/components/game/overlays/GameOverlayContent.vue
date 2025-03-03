<script setup lang="ts">
import type { MbAnimation, MbCustomAnimation } from 'movinblocks'
import { UI } from '@/configs/constants'
import Movinblocks from 'movinblocks'
import { onMounted } from 'vue'

interface Props {
  heading?: string
  hasCloseButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  heading: '',
  hasCloseButton: true,
})

const emit = defineEmits(['close'])

function handleClose() {
  emit('close')
}

onMounted(() => {
  const timelineElements = [
    'overlayContent',
    'overlayContentHeading',
    'overlayHeader',
    'overlayContentContent',
    'overlayContentFooter',
  ]

  const animations: MbAnimation[] = [
    UI.animationClasses.named.scaleIn as MbCustomAnimation,
    'slideInTop',
    'fadeIn',
    'fadeIn',
    'slideInBottom',
  ]

  if (props.hasCloseButton) {
    timelineElements.push('overlayContentClose')
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
    <Button
      v-if="hasCloseButton"
      id="overlayContentClose"
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

    <div>
      <div
        id="overlayHeader"
        class="relative z-30 pointer-events-none"
      >
        <div class="w-full -mb-6 stars">
          <slot name="header" />
        </div>
      </div>

      <div
        id="overlayContent"
        class="z-10 rounded-2xl shadow-2xl border border-secondary-light bg-secondary p-8 text-center overflow-hidden"
      >
        <div>
          <h2
            id="overlayContentHeading"
            class="text-h5 mb-6 content__heading pointer-events-none"
          >
            {{ heading }}
          </h2>
        </div>

        <div
          id="overlayContentContent"
          class="flex flex-col gap-8"
        >
          <div class="place-items-center pointer-events-none">
            <slot />
          </div>

          <div
            id="overlayContentFooter"
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
  </div>
</template>
