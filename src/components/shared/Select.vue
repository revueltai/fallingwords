<script setup lang="ts">
import { computed, defineProps } from 'vue'

interface Props {
  label?: string
  name: string
  selectLabel?: string
  required?: boolean
  disabled?: boolean
  options: FormSelectOption[]
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  selectLabel: 'Select an option',
  required: false,
  disabled: false,
  options: () => [],
})

const emit = defineEmits(['update:modelValue'])
const selectModel = defineModel()

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
  <div class="select-el flex flex-col gap-2">
    <Label
      v-if="name"
      :name="name"
      :label="label"
    />

    <div
      :class="cssClasses"
      class="bg-white border-2 border-grey p-2 rounded-lg form-shadow-top transition-colors hover:border-primary flex gap-2 select-wrapper"
    >
      <select
        :id="name"
        v-model="selectModel"
        :name="name"
        :required="required"
        :disabled="disabled"
        class="bg-transparent outline-none text-black disabled:text-grey invalid:text-quaternary w-full"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option value="" disabled selected hidden>
          {{ selectLabel }}
        </option>

        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          <Icon
            v-if="option.icon"
            :name="option.icon"
          />

          <Flag
            v-else-if="option.image"
            :country-code="option.image"
          />

          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.select-el:has(select:invalid) label,
.select-wrapper:has(select:invalid) {
  @apply border-quaternary-light text-quaternary-light;
}
</style>
