<script setup lang="ts">
import FirstSessionSuggestion from '@/components/ui/first-session/FirstSessionSuggestion.vue'
import { useAppStore } from '@/stores/app.store'
import { Bus } from '@/utils/EventBus'
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
  stepId: string
  userOriginalLocale: GameAlphabetLocale | ''
  userLearnLocale: GameAlphabetLocale | ''
}

const props = defineProps<Props>()

const appStore = useAppStore()

const original = ref('')
const learn = ref('')
const selectedCollection = ref<GameCollection | null>(null)
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

async function handleSetData(uid: string) {
  selectedCollection.value = await appStore.getCollectionById(uid)

  if (selectedCollection.value) {
    locales.value = selectedCollection.value.locales
  }
}

async function handleStoreData() {
  if (props.stepId !== 'wordsPrompt') {
    return
  }

  const rs = await appStore.createWord(selectedCollection.value?.uid, {
    original: original.value,
    learn: learn.value,
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
    <div class="mb-8 flex flex-col gap-4">
      <p class="mb-4">
        Enter a Word for
        <span class="text-primary">{{ selectedCollection?.name }}</span>
      </p>

      <Input
        v-model="original"
        name="original"
        type="text"
        label="Original Word"
        placeholder="Enter original word"
        required
        :country-code="locales?.original"
        :error="formErrors.original"
        @input="handleValidate"
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
