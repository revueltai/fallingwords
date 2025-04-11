<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  isVisible?: boolean
}

withDefaults(defineProps<Props>(), {
  placeholder: 'filter',
  isVisible: true,
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div
    v-if="isVisible"
    class="rounded-xl p-4 bg-secondary border-b border-secondary-light"
  >
    <Input
      :model-value="modelValue"
      type="search"
      icon-name="magnifier"
      :placeholder="`${$t(placeholder)}...`"
      @update:model-value="(value: any) => emit('update:modelValue', value)"
    />
  </div>
</template>
