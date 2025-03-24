<script setup lang="ts">
import { useModalStore } from '@/stores/modal.store'
import { defineEmits, defineProps } from 'vue'

interface Props {
  containerEl?: string
  heading?: string
  hasCloseButton?: boolean
}

withDefaults(defineProps<Props>(), {
  containerEl: 'modal',
  hasCloseButton: true,
})

const emit = defineEmits(['close'])
const modalStore = useModalStore()

function handleClose() {
  modalStore.closeModal()
  emit('close')
}
</script>

<template>
  <teleport
    v-if="modalStore.isOpen"
    :to="`#${containerEl}`"
  >
    <dialog
      class="modal absolute inset-0 w-full h-full flex items-center justify-center z-50"
      @click.self="handleClose"
    >
      <div class="relative max-w-sm text-white rounded-2xl shadow-2xl border border-secondary-light bg-secondary p-8 text-center">
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
          v-if="$slots.header || heading"
          class="flex justify-between items-center mb-4 text-center"
        >
          <h3
            v-if="heading"
            class="text-center w-full"
          >
            {{ heading }}
          </h3>

          <template v-else-if="$slots.header">
            <slot name="header" />
          </template>
        </div>

        <div>
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
