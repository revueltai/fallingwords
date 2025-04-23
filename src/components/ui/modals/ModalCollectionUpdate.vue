<script setup lang="ts">
import { useErrorService } from '@/composables/useErrorService'
import { useAppStore } from '@/stores/app.store'
import { onMounted, ref } from 'vue'

const props = defineProps<{ uid: string }>()

const emit = defineEmits(['update'])

const { handleError } = useErrorService()
const appStore = useAppStore()

const collectionName = ref('')
const collectionLocaleOriginal = ref('')
const collectionLocaleLearn = ref('')

function validateForm(): boolean {
  if (!(collectionName.value && collectionLocaleOriginal.value && collectionLocaleLearn.value)) {
    return handleError({ showToast: true, msg: 'authMissingFields' })
  }

  if (collectionLocaleOriginal.value === collectionLocaleLearn.value) {
    return handleError({ showToast: true, msg: 'collectionSameLanguageError' })
  }

  return true
}

function handleSubmit(event: Event) {
  event.preventDefault()

  const formIsValid = validateForm()

  if (formIsValid) {
    emit('update', {
      uid: props.uid,
      name: collectionName.value,
      localeOriginal: collectionLocaleOriginal.value,
      localeLearn: collectionLocaleLearn.value,
    })
  }
}

onMounted(async () => {
  await appStore.setFormLocales()
  const collection = await appStore.getCollectionById(props.uid)

  if (collection) {
    collectionName.value = collection.name
    collectionLocaleOriginal.value = String(collection.locale_original)
    collectionLocaleLearn.value = String(collection.locale_learn)
  }
})
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-8 flex flex-col gap-4">
      <Input
        v-model="collectionName"
        name="collectionName"
        type="text"
        :required="true"
        :label="$t('collectionName')"
        :placeholder="$t('enterName')"
      />

      <Select
        v-model="collectionLocaleOriginal"
        :options="appStore.formLocales"
        :asset="collectionLocaleOriginal"
        name="collectionLocaleOriginal"
        type="text"
        :required="true"
        :label="$t('nativeLanguage')"
        :select-label="$t('nativeLanguage')"
      />

      <Select
        v-model="collectionLocaleLearn"
        :options="appStore.formLocales"
        :asset="collectionLocaleLearn"
        name="collectionLocaleLearn"
        type="text"
        :label="$t('learnLanguage')"
        :select-label="$t('learnLanguage')"
      />
    </div>

    <Button
      size="md"
      has-icon
      type="submit"
    >
      {{ $t('saveChanges') }}
    </Button>
  </form>
</template>
