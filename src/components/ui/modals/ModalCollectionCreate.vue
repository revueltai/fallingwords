<script setup lang="ts">
import { useErrorService } from '@/composables/useErrorService'
import { useAppStore } from '@/stores/app.store'
import { useUserStore } from '@/stores/user.store'
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits(['create'])

const { handleError } = useErrorService()
const appStore = useAppStore()
const userStore = useUserStore()

const collectionName = ref('')
const collectionLocaleOriginal = ref<AppLocaleCode | ''>(userStore.originalLocale || '')
const collectionLocaleLearn = ref<AppLocaleCode | ''>(userStore.learnLocale || '')

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
        :asset="collectionLocaleOriginal"
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
        :asset="collectionLocaleLearn"
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
      {{ $t('add') }}
    </Button>
  </form>
</template>
