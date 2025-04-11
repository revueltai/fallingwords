<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  uid: string
  name: string
  locales: GameLocale
  wordCount: number
  hasButtons?: boolean
  selectable?: boolean
  isSelected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hasButtons: true,
  selectable: false,
  isSelected: false,
})

const emit = defineEmits([
  'selectCollection',
  'clickText',
  'update',
  'delete',
])

const hasWords = computed(() => props.wordCount > 0)
const isDisabled = computed(() => hasWords.value && props.selectable && props.isSelected)
const cssClasses = computed(() => {
  const output = []

  if (props.selectable && !hasWords.value) {
    output.push('opacity-20 cursor-default')
  } else {
    output.push(!props.isSelected && 'hover:border-secondary-light hover:bg-secondary')
  }

  output.push(props.isSelected ? 'border-tertiary-dark' : 'border-secondary')

  return output.join(' ')
})

function handleTextClick() {
  emit('clickText', props.uid)
}

function handleCardClick() {
  if (props.selectable && hasWords.value) {
    emit('selectCollection', props.uid)
  }
}
</script>

<template>
  <div
    :class="cssClasses"
    class="relative overflow-hidden cursor-pointer rounded-2xl p-4 border transition-colors flex items-center w-full"
    @click="handleCardClick"
  >
    <div
      v-if="isDisabled"
      class="absolute left-0 top-0 z-10 w-full h-full transition-colors flex items-center justify-end pr-6"
    >
      <div
        :class="isSelected ? 'anim-scale-in-timed' : 'anim-scale-out-timed'"
        class="flex items-center justify-center bg-tertiary border-tertiary-light border rounded-full p-2 w-10 h-10"
      >
        <Icon
          name="check"
          size="sm"
          stroke-width="4"
        />
      </div>
    </div>

    <div
      :class="isSelected && 'opacity-60'"
      class="flex justify-between items-center gap-4 overflow-hidden transition-opacity w-full"
    >
      <div
        class="flex justify-between items-center gap-4"
        @click="handleTextClick"
      >
        <div class="relative w-11 h-13 flex-shrink-0">
          <Flag
            :country-code="locales.original"
            size="sm"
            class="absolute top-1 left-2"
          />

          <Flag
            :country-code="locales.learn"
            size="sm"
            class="absolute top-5 left-5"
          />

          <Icon
            name="skip"
            class="absolute top-4 left-1.5 -scale-x-100 shadow-lg rotate-180"
          />

          <img
            src="/images/collections/book3.svg"
            width="48"
            height="48"
          >
        </div>

        <div class="text-start truncate w-full">
          <h3
            :title="name"
            class="text-white text-p truncate max-w-28 md:max-w-none"
          >
            {{ name }}
          </h3>

          <p
            class="text-xs"
            :class="wordCount ? 'text-primary' : 'text-quaternary-light'"
          >
            {{ wordCount }} {{ $t('words') }}
          </p>
        </div>
      </div>

      <div
        v-if="hasButtons"
        class="flex items-center gap-4 h-full"
      >
        <Button
          icon-only
          size="md"
          @click="handleTextClick"
        >
          <Icon
            name="eye"
            size="sm"
          />
        </Button>

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
