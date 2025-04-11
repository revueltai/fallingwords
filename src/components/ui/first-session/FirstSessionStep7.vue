<script setup lang="ts">
import FirstSessionSuggestion from '@/components/ui/first-session/FirstSessionSuggestion.vue'
import { useAppStore } from '@/stores/app.store'
import { Bus } from '@/utils/EventBus'
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
  stepId: string
  userOriginalLocale: AppLocaleCode | ''
  userLearnLocale: AppLocaleCode | ''
}

const props = defineProps<Props>()

const appStore = useAppStore()

const collectionName = ref('')
const formErrors = ref({ collectionName: '' })

function handleSetSuggestionName(payload: { collectionName: string }) {
  if (payload.collectionName) {
    collectionName.value = payload.collectionName
  }

  handleValidate()
}

function validateForm(): boolean {
  return !!collectionName.value
}

async function handleValidate(event: Event | null = null) {
  if (event) {
    event.preventDefault()
  }

  if (validateForm()) {
    Bus.emit('firstSessionEnableCta')
  }
}

async function handleStoreData() {
  if (props.stepId !== 'collectionsPrompt') {
    return
  }

  const rs = await appStore.createCollection({
    name: collectionName.value,
    localeOriginal: props.userOriginalLocale,
    localeLearn: props.userLearnLocale,
  })

  if (rs) {
    Bus.emit('firstSessionGotoNextStep', { collectionUid: rs })
  }
}

onMounted(async () => {
  await appStore.setFormLocales()
  Bus.on('firstSessionSaveStepData', handleStoreData)
})

onUnmounted(() => Bus.off('firstSessionSaveStepData', handleStoreData))
</script>

<template>
  <form class="anim-scale-in-timed">
    <div class="mb-8 flex flex-col gap-2 sm:gap-4">
      <Input
        v-model="collectionName"
        name="collectionName"
        type="text"
        :label="$t('collectionName')"
        :placeholder="$t('enterAName')"
        :error="formErrors.collectionName"
        required
        @input="handleValidate"
        @change="handleValidate"
      />

      <FirstSessionSuggestion
        :text="$t('collectionName')"
        :user-original-locale="userOriginalLocale"
        @click="handleSetSuggestionName"
      />
    </div>
  </form>
</template>
