<script setup lang="ts">
import { isMobile } from '@/utils'

interface Props {
  iconName?: IconName
  iconType?: IconType
  iconColor?: Color
  text?: string | number
  borderColor?: Color
  backgroundColor?: Color
  padding?: string | 'none'
}

withDefaults(defineProps<Props>(), {
  iconName: 'gem',
  iconType: 'fill',
  iconColor: 'white',
  text: '',
  borderColor: 'secondary-light',
  backgroundColor: 'secondary-dark',
  padding: 'px-4 pt-1 pb-2',
})
</script>

<template>
  <div
    :class="`bg-${backgroundColor} border-${borderColor} ${padding !== 'none' ? padding : ''}`"
    class="flex gap-1 items-center border rounded-full justify-center"
  >
    <Button
      class="mt-2 self-start w-full pr-3"
      size="sm"
      background-color="secondary-dark"
      border-color="secondary-light"
      has-icon
    >
      <Icon
        :name="iconName"
        :color="iconColor"
        :type="iconType"
        :size="isMobile() ? 'sm' : 'lg'"
      />

      <span class="text-md sm:text-lg">
        {{ text }}
      </span>
    </Button>
  </div>
</template>
