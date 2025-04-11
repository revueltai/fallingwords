<script setup lang="ts">
import { isMobile } from '@/utils'
import { Bus } from '@/services/EventBusService'

const controls: {
  direction: CharacterMobileControlDirection
  iconName: string
}[] = [
  {
    direction: 'left',
    iconName: 'chevronLeft',
  },
  {
    direction: 'right',
    iconName: 'chevronRight',
  },
]

function handleTouch(type: 'start' | 'end', direction: CharacterMobileControlDirection) {
  const eventName = type === 'start'
    ? 'mobileControlStart'
    : 'mobileControlEnd'

  Bus.emit(eventName, direction)
}
</script>

<template>
  <div
    v-if="isMobile()"
    class="relative flex justify-between transform translate-y-1/2 px-5 z-10"
  >
    <Button
      v-for="(button, index) in controls"
      :key="index"
      :has-shadow="false"
      background-color="secondary-dark"
      border-color="senary-dark"
      has-icon
      class="anim-scale-in-timed active:opacity-50"
      @touchstart="handleTouch('start', button.direction)"
      @touchend="handleTouch('end', button.direction)"
    >
      <Icon
        :name="button.iconName"
        size="lg"
        stroke-width="1"
      />
    </Button>
  </div>
</template>
