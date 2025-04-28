<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  direction?: 'row' | 'col'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  name?: string
  required?: boolean
  disabled?: boolean
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'col',
  size: 'md',
  label: '',
  name: '',
  required: false,
  disabled: false,
  modelValue: false,
})

const emit = defineEmits(['update:modelValue'])

const cssClasses = computed(() => {
  const output = ['border']

  if (props.modelValue) {
    output.push('bg-tertiary border-tertiary-dark')
  } else {
    output.push('bg-secondary-light border-secondary-light')
  }

  if (props.disabled) {
    output.push('bg-secondary cursor-not-allowed opacity-50')
  }

  if (props.size === 'sm') {
    output.push('w-9 p-0.5')
  } else if (props.size === 'md') {
    output.push('w-14 p-1')
  } else {
    output.push('w-16 p-1')
  }

  return output
})

const cssClassesKnob = computed(() => {
  const output = ['transform']

  if (props.modelValue) {
    output.push('bg-tertiary-light translate-x-full')
  } else {
    output.push('bg-secondary-dark')
  }

  if (props.size === 'sm') {
    output.push('w-4 h-4')
  } else if (props.size === 'md') {
    output.push('w-6 h-6')
  } else {
    output.push('w-5 h-5')
  }

  if (props.disabled) {
    output.push('cursor-not-allowed')
  }

  return output
})
</script>

<template>
  <div
    class="flex gap-2"
    :class="direction === 'col' ? 'flex-col' : 'flex-row-reverse items-center justify-end'"
  >
    <Label
      v-if="label"
      :label="label"
      :for="name"
      class="transition-colors"
    />

    <div class="flex items-center gap-2">
      <label class="flex items-center cursor-pointer">
        <input
          :id="name"
          :checked="modelValue"
          type="checkbox"
          :name="name"
          :disabled="disabled"
          class="hidden"
          @change="emit('update:modelValue', !modelValue)"
        >

        <span
          class="rounded-full relative transition-colors"
          :class="cssClasses"
        >
          <span
            class="relative block rounded-full transition-transform"
            :class="cssClassesKnob"
          />
        </span>
      </label>
    </div>
  </div>
</template>
