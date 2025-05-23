<script setup lang="ts">
import { useModalStore } from '@/stores/modal.store'

interface Props {
  name: string
  headerAsset?: string
  containerEl?: string
  heading?: string
  byline?: string
  hasCloseButton?: boolean
}

withDefaults(defineProps<Props>(), {
  headerAsset: '',
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
    v-if="modalStore.isOpen(name)"
    :to="`#${containerEl}`"
  >
    <dialog
      class="modal absolute inset-0 w-full h-full flex items-center justify-center z-50 anim-fade-in-timed"
      @click.self="handleClose"
    >
      <div class="relative min-w-xs max-w-xs text-white rounded-2xl shadow-2xl border border-secondary-light bg-secondary p-8 text-center sm:max-w-sm">
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
          v-if="$slots.header || heading || headerAsset"
          class="flex justify-between items-center mb-4 text-center w-full"
        >
          <div class="w-full">
            <h3
              v-if="heading"
              class="text-center w-full text-xl"
              :class="headerAsset && 'mt-6'"
            >
              {{ heading }}
            </h3>

            <p
              v-if="byline"
              class="px-2 text-sm text-primary-light"
            >
              {{ byline }}
            </p>
          </div>

          <div
            v-if="headerAsset"
            class="absolute left-0 top-0 flex items-end justify-center w-full -mt-8"
          >
            <div class="mx-4 bg-secondary border-secondary-light border border-b-0 rounded-t-full w-1/2 h-8">
              <img
                :src="headerAsset"
                width="160"
                height="160"
                class="block mx-auto -mt-20"
              >
            </div>
          </div>

          <template v-else-if="$slots.header">
            <slot name="header" />
          </template>
        </div>

        <div class="text-sm">
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
