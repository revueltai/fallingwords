<script setup lang="ts">
import FirstSessionSuggestion from '@/components/ui/first-session/FirstSessionSuggestion.vue'
import { APP_LOCALSTORAGE_KEYS } from '@/configs/constants'
import { Bus } from '@/services/EventBusService'
import { LocalStorageService } from '@/services/LocalStorageService'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  stepId: string
  userOriginalLocale: AppLocaleCode | ''
  userLearnLocale: AppLocaleCode | ''
}

const props = defineProps<Props>()

const router = useRouter()

const original = ref('')
const learn = ref('')
const selectedCollection = ref<AppCollection | null>(null)
const locales = ref<GameLocale | null>(null)

const formErrors = ref({
  original: '',
  learn: '',
})

function handleSetSuggestionName(payload: { wordOriginalName: string, wordLearnName: string }) {
  if (payload.wordOriginalName) {
    original.value = payload.wordOriginalName
  }

  if (payload.wordLearnName) {
    learn.value = payload.wordLearnName
  }

  handleValidate()
}

function validateForm(): boolean {
  return !!(original.value && learn.value)
}

async function handleValidate(event: Event | null = null) {
  if (event) {
    event.preventDefault()
  }

  if (validateForm()) {
    Bus.emit('firstSessionEnableCta')
  }
}

async function handleSetData() {
  selectedCollection.value = LocalStorageService.loadStoreData(APP_LOCALSTORAGE_KEYS.userFirstSession)

  if (!selectedCollection.value) {
    router.push({ name: 'Welcome' })
    return
  }

  locales.value = {
    original: selectedCollection.value.locale_original,
    learn: selectedCollection.value.locale_learn,
  }
}

async function handleStoreData() {
  if (props.stepId !== 'wordsPrompt') {
    return
  }

  const storageData = LocalStorageService.loadStoreData(APP_LOCALSTORAGE_KEYS.userFirstSession)
  const rs = LocalStorageService.saveStoreData(APP_LOCALSTORAGE_KEYS.userFirstSession, {
    ...storageData,
    word: {
      original: original.value,
      learn: learn.value,
    },
  })

  if (rs) {
    Bus.emit('firstSessionGotoNextStep')
  }
}

onMounted(async () => {
  Bus.on('firstSessionSetStepData', handleSetData)
  Bus.on('firstSessionSaveStepData', handleStoreData)
  Bus.emit('firstSessionGetData')
})

onUnmounted(() => {
  Bus.off('firstSessionSetStepData', handleSetData)
  Bus.off('firstSessionSaveStepData', handleStoreData)
})
</script>

<template>
  <form
    v-if="selectedCollection"
    class="anim-scale-in-timed"
  >
    <div class="mb-8 flex flex-col gap-2 sm:gap-4">
      <p class="mb-4">
        {{ $t('enterWordFor') }}
        <span class="text-primary">{{ selectedCollection?.name }}</span>
      </p>

      <Input
        v-model="original"
        name="original"
        type="text"
        :label="$t('originalWord')"
        :placeholder="$t('enterOriginalWord')"
        required
        :country-code="locales?.original"
        :error="formErrors.original"
        @input="handleValidate"
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
        @input="handleValidate"
      />

      <FirstSessionSuggestion
        text="Word"
        :user-original-locale="userOriginalLocale"
        :user-learn-locale="userLearnLocale"
        @click="handleSetSuggestionName"
      />
    </div>
  </form>
</template>
