<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import { Bus } from '@/utils/EventBus'
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Props {
  userOriginalLocale: GameAlphabetLocale | ''
}

const props = withDefaults(defineProps<Props>(), {
  userOriginalLocale: '',
})

const appStore = useAppStore()

const collectionName = ref('')
const collectionLocaleOriginal = ref(props.userOriginalLocale)
const collectionLocaleLearn = ref('')

const sanitizedLearnLocales = computed(() => {
  return appStore.formLocales.filter((option: FormSelectOption) => option.value !== props.userOriginalLocale)
})

const formErrors = ref({
  collectionName: '',
  collectionLocaleOriginal: '',
  collectionLocaleLearn: '',
})

function validateForm(): boolean {
  return !!(collectionName.value && collectionLocaleOriginal.value && collectionLocaleLearn.value)
    && (collectionLocaleOriginal.value !== collectionLocaleLearn.value)
}

async function handleValidate(event: Event) {
  event.preventDefault()

  if (validateForm()) {
    Bus.emit('firstSessionEnableCta')
  }
}

async function handleStoreData(data: { step: number }) {
  if (data.step !== 7) {
    return
  }

  const rs = await appStore.createCollection({
    name: collectionName.value,
    localeOriginal: collectionLocaleOriginal.value,
    localeLearn: collectionLocaleLearn.value,
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
    <div class="mb-8 flex flex-col gap-4">
      <Input
        v-model="collectionName"
        name="collectionName"
        type="text"
        label="Collection Name"
        placeholder="Enter a name"
        required
        :error="formErrors.collectionName"
        @input="handleValidate"
      />

      <Select
        v-model="collectionLocaleLearn"
        :options="sanitizedLearnLocales"
        name="collectionLocaleLearn"
        label="Language to Learn"
        select-label="Select a Language"
        required
        :error="formErrors.collectionLocaleLearn"
        @change="handleValidate"
        @input="handleValidate"
      />
    </div>
  </form>
</template>
