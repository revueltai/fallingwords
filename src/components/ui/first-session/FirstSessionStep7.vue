<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import { Bus } from '@/utils/EventBus'
import { onMounted, onUnmounted, ref } from 'vue'

const appStore = useAppStore()

const collectionName = ref('Animals')
const collectionLocaleOriginal = ref('en')
const collectionLocaleLearn = ref('de')

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
        v-model="collectionLocaleOriginal"
        :options="appStore.formLocales"
        name="collectionLocaleOriginal"
        type="text"
        label="Native Language"
        select-label="Select a Language"
        required
        :error="formErrors.collectionLocaleOriginal"
        @input="handleValidate"
      />

      <Select
        v-model="collectionLocaleLearn"
        :options="appStore.formLocales"
        name="collectionLocaleLearn"
        type="text"
        label="Language to Learn"
        select-label="Select a Language"
        required
        :error="formErrors.collectionLocaleLearn"
        @change="handleValidate"
      />
    </div>
  </form>
</template>
