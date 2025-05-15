<script setup lang="ts">
import { useErrorService } from '@/composables/useErrorService'
import { ToastService } from '@/services/ToastService'
import { useSettingsStore } from '@/stores/settings.store'
import { createSelectOptions, isWordNounType } from '@/utils'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  localeOriginal: AppLocaleCode
  localeLearn: AppLocaleCode
}

const props = defineProps<Props>()

const emit = defineEmits(['create'])

const { t } = useI18n()
const { handleError } = useErrorService()

const settingsStore = useSettingsStore()

const localeOriginal = ref<AppLocaleCode | null>(null)
const localeLearn = ref<AppLocaleCode | null>(null)
const wordType = ref('')
const original = ref('')
const originalArticle = ref('')
const learn = ref('')
const learnArticle = ref('')

const formErrors = ref({
  wordType: '',
  original: '',
  learn: '',
  originalArticle: '',
  learnArticle: '',
})

const wordFieldsData = ref([
  {
    inputName: 'original',
    inputArticleName: 'originalArticle',
    inputError: formErrors.value.original,
    model: original,
    modelArticle: originalArticle,
    locale: localeOriginal,
    label: t('originalWord'),
    placeholder: t('enterOriginalWord'),
    articleOptions: createSelectOptions({
      values: settingsStore.appLocalesArticles[props.localeOriginal]?.definite,
    }),
  },
  {
    inputName: 'learn',
    inputArticleName: 'learnArticle',
    inputError: formErrors.value.learn,
    model: learn,
    modelArticle: learnArticle,
    locale: localeLearn,
    label: t('wordToLearn'),
    placeholder: t('enterWordToLearn'),
    articleOptions: createSelectOptions({
      values: settingsStore.appLocalesArticles[props.localeLearn]?.definite,
    }),
  },
])

const showArticleSelect = computed(() => isWordNounType(wordType.value))

function validateForm(): boolean {
  if (showArticleSelect.value && !(originalArticle.value && learnArticle.value)) {
    return handleError({ showToast: true, msg: 'authMissingFields' })
  }

  if (!wordType.value || !(original.value && learn.value)) {
    return handleError({ showToast: true, msg: 'authMissingFields' })
  }

  return true
}

function handleTypeChange(event: Event) {
  wordType.value = (event.target as HTMLSelectElement)?.value
}

function handleSubmit(event: Event) {
  event.preventDefault()

  const formIsValid = validateForm()

  if (formIsValid) {
    emit('create', {
      original: original.value,
      learn: learn.value,
      originalArticle: originalArticle.value,
      learnArticle: learnArticle.value,
      wordType: wordType.value,
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
      <Select
        v-model="wordType"
        :label="$t('wordType')"
        :select-label="$t('selectValue')"
        :options="createSelectOptions({
          values: settingsStore.appWordTypes,
          labelFormatter: (v) => $t(v),
        })"
        name="wordType"
        @change="handleTypeChange"
      />

      <div
        v-for="(item, index) in wordFieldsData"
        :key="index"
        class="flex flex-col items-start w-full"
      >
        <Label
          v-if="showArticleSelect"
          :label="item.label"
        />

        <div class="flex gap-3 w-full">
          <Select
            v-if="showArticleSelect"
            v-model="item.modelArticle"
            :name="item.inputArticleName"
            :asset="showArticleSelect && item.locale"
            :options="item.articleOptions"
          />

          <Input
            v-model="item.model"
            :name="item.inputName"
            type="text"
            :label="!showArticleSelect ? item.label : null"
            :placeholder="item.placeholder"
            required
            :country-code="!showArticleSelect ? item.locale : ''"
            :error="item.inputError"
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
      {{ $t('add') }}
    </Button>
  </form>
</template>
