<script setup lang="ts">
import Word from '@/components/ui/Word.vue'

interface Props {
  uid: string
  original: string
  learn: string
  locales: GameLocale
}

defineProps<Props>()

const emit = defineEmits([
  'update',
  'delete',
])

function handleClick() {
  console.log('click')
}
</script>

<template>
  <div class="relative overflow-hidden cursor-pointer rounded-2xl p-4 border border-secondary transition-colors flex items-center w-full hover:border-secondary-light hover:bg-secondary">
    <div class="flex justify-between items-center gap-4 overflow-hidden transition-opacity w-full">
      <div
        class="flex justify-between items-center gap-4"
        @click="handleClick"
      >
        <div class="text-start truncate w-full flex flex-col gap-3">
          <Word
            :country-code="locales.original!"
            :word="original"
          />

          <Word
            :country-code="locales.learn!"
            :word="learn"
          />
        </div>
      </div>

      <div class="flex items-center gap-4 h-full">
        <Button
          icon-only
          background-color="tertiary"
          border-color="tertiary-light"
          size="md"
          @click="emit('update', uid)"
        >
          <Icon
            name="pencil"
            size="sm"
            type="fill"
          />
        </Button>

        <Button
          size="sm"
          background-color="quaternary"
          border-color="quaternary-light"
          icon-only
          @click="emit('delete', uid)"
        >
          <Icon
            name="trashbin"
            size="sm"
            type="fill"
          />
        </Button>
      </div>
    </div>
  </div>
</template>
