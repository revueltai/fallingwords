<script setup lang="ts">
import { useErrorService } from '@/composables/useErrorService'
import { ToastService } from '@/services/ToastService'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  localeOriginal: AppLocaleCode
  localeLearn: AppLocaleCode
}

const props = defineProps<Props>()

const emit = defineEmits(['create'])

const { t } = useI18n()
const { handleError } = useErrorService()

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
    emit('create', {
      original: original.value,
      learn: learn.value,
    })
  }
}

onMounted(() => {
  if (!(props.localeLearn && props.localeOriginal)) {
    ToastService.emitToast(t('failedLoadLocales'), 'error')
  }

  localeOriginal.value = props.localeOriginal
  localeLearn.value = props.localeLearn
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
      {{ $t('add') }}
    </Button>
  </form>
</template>
