<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

interface Props {
  containerEl: string
  hasCloseButton?: boolean
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits(['onClose'])

function handleClose() {
  emit('onClose')
}
</script>

<template>
  <teleport
    v-if="isOpen"
    :to="`#${containerEl}`"
  >
    <dialog
      class="modal absolute inset-0 w-full h-full flex items-center justify-center z-50"
      @click.self="handleClose"
    >
      <div class="relative max-w-80 text-white rounded-2xl shadow-2xl border border-secondary-light bg-secondary p-8 text-center">
        <Button
          v-if="hasCloseButton"
          background-color="quaternary"
          border-color="quaternary-light"
          icon-only
          class="absolute -top-2 -right-2 z-30"
          @click="handleClose"
        >
          <Icon
            name="cross"
            size="md"
            stroke-width="4"
          />
        </Button>

        <div
          v-if="$slots.header"
          class="flex justify-between items-center mb-4"
        >
          <slot name="header" />
        </div>

        <div class="mb-4">
          <slot />
        </div>

        <div
          v-if="$slots.footer"
          class="flex justify-end mt-4"
        >
          <slot name="footer" />
        </div>
      </div>
    </dialog>
  </teleport>
</template>

<style scoped>
dialog {
  background-color: rgba(5, 5, 15, .7);
}
</style>
