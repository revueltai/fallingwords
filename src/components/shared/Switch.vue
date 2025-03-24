<script setup lang="ts">
import { computed, defineProps } from 'vue'

interface Props {
  label?: string
  name?: string
  required?: boolean
  disabled?: boolean
  modelValue: boolean
}

const props = withDefaults(defineProps<Props>(), {
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

  return output
})

const cssClassesKnob = computed(() => {
  const output = ['transform']

  if (props.modelValue) {
    output.push('bg-tertiary-light translate-x-full')
  } else {
    output.push('bg-secondary-dark')
  }

  if (props.disabled) {
    output.push('cursor-not-allowed')
  }

  return output
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <Label
      v-if="label"
      :label="label"
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
          class="w-14 p-1 rounded-full relative transition-colors"
          :class="cssClasses"
        >
          <span
            class="relative block w-6 h-6 rounded-full transition-transform"
            :class="cssClassesKnob"
          />
        </span>
      </label>
    </div>
  </div>
</template>
