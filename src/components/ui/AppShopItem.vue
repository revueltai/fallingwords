<script lang="ts" setup>
import ItemIndicator from '@/components/ui/ItemIndicator.vue'
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
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: 'secondary-dark',
  backgroundColorHover: 'secondary-dark',
  borderColor: 'secondary',
  borderColorHover: 'secondary-light',
  direction: 'col',
  padding: 'p-4',
  cssClasses: '',
})

const emit = defineEmits(['click'])

const cssClasses = computed(() => {
  return `border-${props.borderColor} bg-${props.backgroundColor} hover:border-${props.borderColorHover} hover:bg-${props.backgroundColorHover} flex-${props.direction} ${props.padding} ${props.cssClasses}`
})
</script>

<template>
  <div
    :class="cssClasses"
    class="flex items-center rounded-2xl gap-3 border border-b-4 transition-colors cursor-pointer"
    @click="emit('click', uid)"
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

    <ItemIndicator
      :text="value"
      border-color="transparent"
      background-color="transparent"
      padding="none"
    />
  </div>
</template>
