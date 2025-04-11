<script setup lang="ts">
import { emitToast } from '@/utils/ToastEmitter'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  locales: GameLocale
}

const props = defineProps<Props>()

const emit = defineEmits(['create'])

const { t } = useI18n()

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
    emit('create', {
      original: original.value,
      learn: learn.value,
    })
  }
}

onMounted(() => {
  if (!props.locales) {
    emitToast(t('failedLoadLocales'), 'error')
  }

  locales.value = props.locales
})
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-8 flex flex-col gap-4">
      <Input
        v-model="original"
        name="original"
        type="text"
        :label="$t('originalWord')"
        :placeholder="$t('enterOriginalWord')"
        required
        :country-code="locales?.original"
        :error="formErrors.original"
      />

      <Input
        v-model="learn"
        name="learn"
        type="text"
        :label="$t('wordToLearn')"
        :placeholder="$t('enterWordToLearn')"
        required
        :country-code="locales?.learn"
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
