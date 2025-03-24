<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Filter...',
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="rounded-xl p-4 bg-secondary border-b border-secondary-light">
    <Input
      :model-value="modelValue"
      type="search"
      icon-name="magnifier"
      :placeholder="placeholder"
      @update:model-value="(value: any) => emit('update:modelValue', value)"
    />
  </div>
</template>
