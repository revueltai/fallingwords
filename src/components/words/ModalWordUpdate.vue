<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import { toastEmitter } from '@/utils/ToastEmitter'
import { onMounted, ref } from 'vue'

interface Props {
  collection: GameCollection
  wordUid: string
}

const props = defineProps<Props>()

const emit = defineEmits(['update'])

const appStore = useAppStore()

const original = ref('')
const learn = ref('')
const locales = ref<GameLocale | null>(null)

const formErrors = ref({
  original: '',
  learn: '',
})

function validateForm(): boolean {
  return !!(original.value && learn.value)
}

function handleSubmit(event: Event) {
  event.preventDefault()

  if (validateForm()) {
    emit('update', {
      original: original.value,
      learn: learn.value,
    })
  }
}

onMounted(async () => {
  const word = await appStore.getWordById(props.collection.uid, props.wordUid)

  if (!word || !props.collection) {
    toastEmitter.emit('toast', { message: 'Failed to load word', type: 'error' })
  }

  original.value = word.original
  learn.value = word.learn
  locales.value = props.collection?.locales
})
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-8 flex flex-col gap-4">
      <Input
        v-model="original"
        name="original"
        type="text"
        label="Original Word"
        placeholder="Enter original word"
        required
        :country-code="locales?.original"
        :error="formErrors.original"
      />

      <Input
        v-model="learn"
        name="learn"
        type="text"
        label="Word to Learn"
        placeholder="Enter word to learn"
        required
        :country-code="locales?.learn"
        :error="formErrors.learn"
      />
    </div>

    <Button
      size="md"
      has-icon
      type="submit"
    >
      Save Word
    </Button>
  </form>
</template>
