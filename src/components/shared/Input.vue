<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue'
import { computed, defineProps } from 'vue'

interface Props {
  label?: string
  labelColor?: Color
  placeholder?: string
  name?: string
  required?: boolean
  disabled?: boolean
  type?: InputTypeHTMLAttribute
  countryCode?: string
  iconName?: IconName
  iconType?: IconType
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: 'Enter a text',
  type: 'text',
  required: false,
  disabled: false,
  countryCode: '',
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
  <div class="input-el flex flex-col gap-2">
    <Label
      v-if="name"
      :name="name"
      :label="label"
      :color="labelColor"
      class="transition-colors"
    />

    <div
      :class="cssClasses"
      class="input-wrapper flex items-center gap-2 bg-white border-2 border-grey p-2 rounded-lg transition-colors hover:border-primary invalid:text-quaternary form-shadow-top"
    >
      <Flag
        v-if="countryCode"
        :country-code="countryCode"
      />

      <Icon
        v-else-if="iconName"
        :name="iconName"
        :type="iconType"
        color="senary-light"
        size="md"
        stroke-width="3"
      />

      <input
        :id="name"
        v-model="inputModel"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        class="w-full bg-transparent outline-none text-black disabled:text-grey invalid:text-quaternary transition-colors"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
    </div>
  </div>
</template>

<style scoped>
.input-el:has(input:invalid) label,
.input-wrapper:has(input:invalid) {
  @apply border-quaternary-light text-quaternary-light;
}
</style>
