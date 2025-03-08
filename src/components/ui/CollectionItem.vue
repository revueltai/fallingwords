<script setup lang="ts">
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
  'update',
  'delete',
])

function handleSelectCollection() {
  if (props.selectable) {
    emit('selectCollection', props.uid)
  }
}
</script>

<template>
  <div
    :class="!isSelected && 'hover:border-secondary-light hover:bg-secondary'"
    class="relative overflow-hidden cursor-pointer rounded-2xl p-4 border border-secondary transition-colors flex items-center w-full"
    @click="handleSelectCollection"
  >
    <div
      v-if="selectable && isSelected"
      class="absolute left-0 top-0 z-10 w-full h-full transition-colors flex items-center justify-center"
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
      :class="isSelected && 'opacity-25'"
      class="flex justify-between items-center gap-4 overflow-hidden transition-opacity w-full"
    >
      <div class="flex justify-between items-center gap-4">
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

          <p class="text-primary text-xs">
            {{ wordCount }} words
          </p>
        </div>
      </div>

      <div
        v-if="hasButtons"
        class="flex items-center gap-4 h-full"
      >
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
