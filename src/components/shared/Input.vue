<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue'
import { isMobile } from '@/utils'
import { computed, ref } from 'vue'

interface Props {
  label?: string
  labelColor?: Color
  footnote?: string
  footnoteColor?: Color
  placeholder?: string
  name?: string
  required?: boolean
  disabled?: boolean
  type?: InputTypeHTMLAttribute
  countryCode?: string
  iconName?: IconName
  iconType?: IconType
  hasClickableIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  footnote: '',
  footnoteColor: 'grey',
  placeholder: 'Enter a text',
  type: 'text',
  required: false,
  disabled: false,
  hasClickableIcon: false,
  countryCode: '',
})

const emit = defineEmits(['update:modelValue', 'blur', 'clickIcon'])
const inputModel = defineModel()

const isTouched = ref(false)

const isRequired = computed(() => props.required && isTouched.value)

const cssClasses = computed(() => {
  const output = []

  if (props.disabled) {
    output.push('border-gray')
  }

  if (isRequired.value) {
    output.push('border-quaternary-dark')
  }

  return output
})

function handleIconClick() {
  if (props.hasClickableIcon) {
    emit('clickIcon')
  }
}
</script>

<template>
  <div class="input-el flex flex-col gap-2 xs:text-sm">
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
        :size="isMobile() ? 'sm' : 'md'"
      />

      <Icon
        v-else-if="iconName"
        :name="iconName"
        :type="iconType"
        color="grey"
        :size="isMobile() ? 'sm' : 'md'"
        stroke-width="3"
        @click="handleIconClick"
      />

      <input
        :id="name"
        v-model="inputModel"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :required="isRequired"
        :disabled="disabled"
        class="w-full bg-transparent outline-none text-black disabled:text-grey invalid:text-quaternary transition-colors"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="emit('blur', $event)"
      >

      <p
        v-if="footnote"
        :class="`text-xs text-${footnoteColor}`"
      >
        {{ footnote }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.input-el:has(input:invalid) label,
.input-wrapper:has(input:invalid) {
  @apply border-quaternary-light text-quaternary-light;
}
</style>
