<script setup lang="ts">
import FirstSessionSuggestion from '@/components/ui/first-session/FirstSessionSuggestion.vue'
import { APP_LOCALSTORAGE_KEYS } from '@/configs/constants'
import { Bus } from '@/services/EventBusService'
import { LocalStorageService } from '@/services/LocalStorageService'
import { useSettingsStore } from '@/stores/settings.store'
import { createSelectOptions, isWordNounType } from '@/utils'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  stepId: string
  userOriginalLocale: AppLocaleCode | ''
  userLearnLocale: AppLocaleCode | ''
}

interface LocalesData {
  name: string
  localeOriginal: AppLocaleCode
  localeLearn: AppLocaleCode
}

const props = defineProps<Props>()

const router = useRouter()

const settingsStore = useSettingsStore()

const selectedLocalesData = ref<LocalesData | null>(null)
const localeOriginal = ref<AppLocaleCode | null>(null)
const localeLearn = ref<AppLocaleCode | null>(null)
const wordType = ref('')
const original = ref('')
const originalArticle = ref('')
const learn = ref('')
const learnArticle = ref('')
const articleOptionsOriginal = ref<FormSelectOption[]>([])
const articleOptionsLearn = ref<FormSelectOption[]>([])

const formErrors = ref({
  wordType: '',
  original: '',
  learn: '',
  originalArticle: '',
  learnArticle: '',
})

const showArticleSelect = computed(() => isWordNounType(wordType.value))

function validateForm() {
  if (showArticleSelect.value && !(originalArticle.value && learnArticle.value)) {
    return false
  }

  if (!(original.value && learn.value && wordType.value)) {
    return false
  }

  return true
}

function handleSetSuggestionName(payload: {
  wordOriginalName: string
  wordLearnName: string
  wordOriginalArticle: string
  wordLearnArticle: string
}) {
  wordType.value = 'noun'

  if (payload.wordOriginalName) {
    original.value = payload.wordOriginalName
    originalArticle.value = payload.wordOriginalArticle
  }

  if (payload.wordLearnName) {
    learn.value = payload.wordLearnName
    learnArticle.value = payload.wordLearnArticle
  }

  handleSubmit()
}

function handleWordTypeChange() {
  originalArticle.value = ''
  learnArticle.value = ''
  original.value = ''
  learn.value = ''
}

function handleSubmit(event: Event | null = null) {
  if (event) {
    event.preventDefault()
  }

  const formIsValid = validateForm()
  if (formIsValid) {
    Bus.emit('firstSessionEnableCta')
  }
}

async function handleSetData() {
  selectedLocalesData.value = LocalStorageService.loadStoreData(APP_LOCALSTORAGE_KEYS.userFirstSession)

  if (!selectedLocalesData.value) {
    router.push({ name: 'Welcome' })
    return
  }

  localeOriginal.value = selectedLocalesData.value.localeOriginal
  localeLearn.value = selectedLocalesData.value.localeLearn

  articleOptionsOriginal.value = createSelectOptions({
    values: settingsStore.appLocalesArticles[localeOriginal.value]?.definite,
  })

  articleOptionsLearn.value = createSelectOptions({
    values: settingsStore.appLocalesArticles[localeLearn.value]?.definite,
  })
}

async function handleSaveData() {
  if (props.stepId !== 'wordsPrompt') {
    return
  }

  const storageData = LocalStorageService.loadStoreData(APP_LOCALSTORAGE_KEYS.userFirstSession)
  const rs = LocalStorageService.saveStoreData(APP_LOCALSTORAGE_KEYS.userFirstSession, {
    ...storageData,
    word: {
      wordType: wordType.value,
      original: original.value,
      originalArticle: originalArticle.value,
      learn: learn.value,
      learnArticle: learnArticle.value,
    },
  })

  if (rs) {
    Bus.emit('firstSessionGotoNextStep')
  }
}

onMounted(async () => {
  Bus.on('firstSessionSetStepData', handleSetData)
  Bus.on('firstSessionSaveStepData', handleSaveData)
  Bus.emit('firstSessionGetData')
})

onUnmounted(() => {
  Bus.off('firstSessionSetStepData', handleSetData)
  Bus.off('firstSessionSaveStepData', handleSaveData)
})
</script>

<template>
  <form
    v-if="selectedLocalesData"
    class="anim-scale-in-timed"
    @submit.prevent="handleSubmit"
  >
    <div class="mb-8 flex flex-col gap-2 sm:gap-4">
      <p class="mb-4">
        {{ $t('enterWordFor') }}

        <span class="text-primary">
          {{ selectedLocalesData?.name }}
        </span>
      </p>

      <Select
        v-model="wordType"
        :label="$t('wordType')"
        :select-label="$t('selectValue')"
        :options="createSelectOptions({
          values: settingsStore.appWordTypes,
          labelFormatter: (v) => $t(v),
        })"
        name="wordType"
        @change="handleWordTypeChange"
      />

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

      <FirstSessionSuggestion
        text="Word"
        :user-original-locale="userOriginalLocale"
        :user-learn-locale="userLearnLocale"
        @click="handleSetSuggestionName"
      />
    </div>
  </form>
</template>
