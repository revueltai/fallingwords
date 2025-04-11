<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits(['create'])

const appStore = useAppStore()

const collectionName = ref('')
const collectionLocaleOriginal = ref('')
const collectionLocaleLearn = ref('')

const originalLocaleOptions = computed(() => getOptions(collectionLocaleLearn.value))

const learnLocaleOptions = computed(() => getOptions(collectionLocaleOriginal.value))

const formErrors = ref({
  collectionName: '',
  collectionLocaleOriginal: '',
  collectionLocaleLearn: '',
})

function getOptions(excludeOption: string) {
  return appStore.formLocales?.filter((locale: FormSelectOption) => locale.value !== excludeOption)
}

function validateForm(): boolean {
  return !!(collectionName.value && collectionLocaleOriginal.value && collectionLocaleLearn.value)
}

function handleSubmit(event: Event) {
  event.preventDefault()

  if (validateForm()) {
    emit('create', {
      name: collectionName.value,
      localeOriginal: collectionLocaleOriginal.value,
      localeLearn: collectionLocaleLearn.value,
    })
  }
}

onMounted(async () => await appStore.setFormLocales())
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-8 flex flex-col gap-4">
      <Input
        v-model="collectionName"
        name="collectionName"
        type="text"
        :label="$t('collectionName')"
        :placeholder="$t('enterAName')"
        required
        :error="formErrors.collectionName"
      />

      <Select
        v-model="collectionLocaleOriginal"
        :options="originalLocaleOptions"
        name="collectionLocaleOriginal"
        type="text"
        :label="$t('nativeLanguage')"
        :select-label="$t('selectLanguage')"
        required
        :error="formErrors.collectionLocaleOriginal"
      />

      <Select
        v-model="collectionLocaleLearn"
        :options="learnLocaleOptions"
        name="collectionLocaleLearn"
        type="text"
        :label="$t('learnLanguage')"
        :select-label="$t('selectLanguage')"
        required
        :error="formErrors.collectionLocaleLearn"
      />
    </div>

    <Button
      size="md"
      has-icon
      type="submit"
      class="w-full"
    >
      {{ $t('createCollection') }}
    </Button>
  </form>
</template>
