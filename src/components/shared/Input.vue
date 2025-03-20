<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue'
import { computed, defineProps } from 'vue'

interface Props {
  label?: string
  placeholder?: string
  name: string
  required?: boolean
  disabled?: boolean
  type?: InputTypeHTMLAttribute
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: 'Enter a text',
  type: 'text',
  required: false,
  disabled: false,
})

const emit = defineEmits(['update:modelValue'])
const inputModel = defineModel()

const cssClasses = computed(() => {
  const output = []

  if (props.disabled) {
    output.push('border-gray')
  }

  if (props.required) {
    output.push('border-quaternary-dark')
  }

  return output
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <Label
      v-if="name"
      :name="name"
      :label="label"
    />

    <div
      :class="cssClasses"
      class="bg-white border-2 border-grey p-2 rounded-lg transition-colors hover:border-primary invalid:text-quaternary form-shadow-top"
    >
      <input
        :id="name"
        v-model="inputModel"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        class="bg-transparent outline-none text-black disabled:text-grey invalid:text-quaternary"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
    </div>
  </div>
</template>
