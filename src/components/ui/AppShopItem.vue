<script lang="ts" setup>
import { isMobile } from '@/utils'
import { computed } from 'vue'

interface Props {
  uid: string
  asset: string
  amount: any
  value: string | number
  backgroundColor?: Color
  backgroundColorHover?: Color
  borderColor?: Color
  borderColorHover?: Color
  direction?: 'row' | 'col'
  padding?: string
  cssClasses?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: 'secondary-dark',
  backgroundColorHover: 'secondary-dark',
  borderColor: 'secondary',
  borderColorHover: 'secondary-light',
  direction: 'col',
  padding: 'px-2 py-4',
  cssClasses: '',
  disabled: false,
})

const emit = defineEmits(['click'])

const cssClasses = computed(() => {
  const baseClasses = `border-${props.borderColor} bg-${props.backgroundColor} flex-${props.direction} ${props.padding} ${props.cssClasses}`
  const hoverClasses = props.disabled
    ? ''
    : `hover:border-${props.borderColorHover} hover:bg-${props.backgroundColorHover}`
  const disabledClasses = props.disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer'

  return `${baseClasses} ${hoverClasses} ${disabledClasses}`
})

function handleClick() {
  if (!props.disabled) {
    emit('click', props.uid)
  }
}
</script>

<template>
  <div class="relative">
    <span
      v-if="disabled"
      class="absolute z-10 left-0 top-0 w-full h-full flex items-center justify-center p-3"
    >
      <span class="text-sm bg-tertiary rounded-lg p-3 flex flex-col items-center gap-1">
        <Icon
          name="check"
          size="md"
          color="tertiary-light"
        />
        {{ $t('shopItemOwned') }}
      </span>
    </span>

    <div
      :class="cssClasses"
      class="relative flex items-center rounded-2xl gap-3 border border-b-4 transition-colors cursor-pointer"
    >
      <div class="relative">
        <img
          :src="`/images/shop/${asset}.svg`"
          width="70"
          height="80"
        >

        <span
          v-for="(el, index) in amount"
          :key="index"
          class="absolute right-0 bottom-0 bg-senary rounded-md px-1"
        >
          + {{ el }}
        </span>
      </div>

      <Button
        class="mt-3 self-start mx-auto"
        size="sm"
        background-color="secondary-dark"
        border-color="secondary-light"
        has-icon
        :disabled="disabled"
        @click="handleClick"
      >
        <Icon
          name="gem"
          color="white"
          type="fill"
          :size="isMobile() ? 'sm' : 'lg'"
        />

        <span class="text-md sm:text-lg">
          {{ value }}
        </span>
      </Button>
    </div>
  </div>
</template>
