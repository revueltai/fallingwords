<script setup lang="ts">
import { useErrorService } from '@/composables/useErrorService'
import { ToastService } from '@/services/ToastService'
import { useAppStore } from '@/stores/app.store'
import { useSettingsStore } from '@/stores/settings.store'
import { createSelectOptions, isWordNounType } from '@/utils'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  collection: AppCollection
  wordUid: string
}

const props = defineProps<Props>()

const emit = defineEmits(['update'])

const { t } = useI18n()
const { handleError } = useErrorService()

const settingsStore = useSettingsStore()
const appStore = useAppStore()

const localeOriginal = ref<AppLocaleCode | null>(null)
const localeLearn = ref<AppLocaleCode | null>(null)
const wordType = ref('')
const original = ref('')
const originalArticle = ref('')
const learn = ref('')
const articleOptionsOriginal = ref<FormSelectOption[]>([])
const articleOptionsLearn = ref<FormSelectOption[]>([])
const learnArticle = ref('')

const formErrors = ref({
  wordType: '',
  original: '',
  learn: '',
  originalArticle: '',
  learnArticle: '',
})

const showArticleSelect = computed(() => isWordNounType(wordType.value))

function validateForm(): boolean {
  if (showArticleSelect.value && !(originalArticle.value && learnArticle.value)) {
    return handleError({ showToast: true, msg: 'authMissingFields' })
  }

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
      originalArticle: originalArticle.value,
      learnArticle: learnArticle.value,
      wordType: wordType.value,
    })
  }
}

onMounted(async () => {
  const word = await appStore.getWordById(props.collection.id, props.wordUid)

  if (!word || !props.collection) {
    ToastService.emitToast(t('failedToLoadWord'), 'error')
  }

  localeOriginal.value = props.collection.locale_original
  localeLearn.value = props.collection.locale_learn
  wordType.value = word.type
  originalArticle.value = word.originalArticle
  original.value = word.original
  learn.value = word.learn
  learnArticle.value = word.learnArticle
  articleOptionsOriginal.value = createSelectOptions({
    values: settingsStore.appLocalesArticles[localeOriginal.value]?.definite,
  })
  articleOptionsLearn.value = createSelectOptions({
    values: settingsStore.appLocalesArticles[localeLearn.value]?.definite,
  })
})
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-8 flex flex-col gap-4">
      <div class="flex flex-col items-start w-full">
        <Label :label="$t('wordType')" />

        <div class="border border-senary p-3 rounded-md w-full text-left mt-2">
          {{ $t(wordType) }}
        </div>
      </div>

      <div class="flex flex-col items-start w-full">
        <Label
          v-if="showArticleSelect"
          :label="$t('originalWord')"
        />

        <div class="flex gap-3 w-full">
          <Select
            v-if="showArticleSelect"
            v-model="originalArticle"
            name="originalArticle"
            :asset="showArticleSelect && localeOriginal"
            :options="articleOptionsOriginal"
          />

          <Input
            v-model="original"
            name="original"
            type="text"
            :label="!showArticleSelect ? $t('originalWord') : null"
            :placeholder="$t('enterOriginalWord')"
            :country-code="!showArticleSelect ? localeOriginal : ''"
            :error="formErrors.original"
            required
            class="w-full"
          />
        </div>
      </div>

      <div class="flex flex-col items-start w-full">
        <Label
          v-if="showArticleSelect"
          :label="$t('wordToLearn')"
        />

        <div class="flex gap-3 w-full">
          <Select
            v-if="showArticleSelect"
            v-model="learnArticle"
            name="learnArticle"
            :asset="showArticleSelect && localeLearn"
            :options="articleOptionsLearn"
          />

          <Input
            v-model="learn"
            name="learn"
            type="text"
            :label="!showArticleSelect ? $t('wordToLearn') : null"
            :placeholder="$t('enterWordToLearn')"
            :country-code="!showArticleSelect ? localeLearn : ''"
            :error="formErrors.learn"
            required
            class="w-full"
          />
        </div>
      </div>
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
