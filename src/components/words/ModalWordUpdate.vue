<script setup lang="ts">
import { useErrorService } from '@/composables/useErrorService'
import { ToastService } from '@/services/ToastService'
import { useAppStore } from '@/stores/app.store'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  collection: AppCollection
  wordUid: string
}

const props = defineProps<Props>()

const emit = defineEmits(['update'])

const { t } = useI18n()
const { handleError } = useErrorService()
const appStore = useAppStore()

const original = ref('')
const learn = ref('')
const localeOriginal = ref<AppLocaleCode | null>(null)
const localeLearn = ref<AppLocaleCode | null>(null)

const formErrors = ref({
  original: '',
  learn: '',
})

function validateForm(): boolean {
  if (!(original.value && learn.value)) {
    return handleError({ showToast: true, msg: 'authMissingFields' })
  }

  return true
}

function handleSubmit(event: Event) {
  event.preventDefault()

  const formIsValid = validateForm()

  if (formIsValid) {
    emit('update', {
      original: original.value,
      learn: learn.value,
    })
  }
}

onMounted(async () => {
  const word = await appStore.getWordById(props.collection.id, props.wordUid)

  if (!word || !props.collection) {
    ToastService.emitToast(t('failedToLoadWord'), 'error')
  }

  original.value = word.original
  learn.value = word.learn
  localeOriginal.value = props.collection.locale_original
  localeLearn.value = props.collection.locale_learn
})
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-8 flex flex-col gap-4">
      <Input
        v-model="original"
        name="original"
        type="text"
        :label="$t('nativeWord')"
        :placeholder="$t('enterNativeWord')"
        required
        :country-code="localeOriginal"
        :error="formErrors.original"
      />

      <Input
        v-model="learn"
        name="learn"
        type="text"
        :label="$t('wordToLearn')"
        :placeholder="$t('enterWordToLearn')"
        required
        :country-code="localeLearn"
        :error="formErrors.learn"
      />
    </div>

    <Button
      size="md"
      has-icon
      type="submit"
      class="w-full"
    >
      {{ $t('saveWord') }}
    </Button>
  </form>
</template>
