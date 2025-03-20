<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import { onMounted, ref } from 'vue'

const emit = defineEmits(['create'])

const appStore = useAppStore()

const collectionName = ref('')
const collectionLocaleOriginal = ref('')
const collectionLocaleLearn = ref('')

const formErrors = ref({
  collectionName: '',
  collectionLocaleOriginal: '',
  collectionLocaleLearn: '',
})

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
        label="Collection Name"
        placeholder="Enter a name"
        required
        :error="formErrors.collectionName"
      />

      <Select
        v-model="collectionLocaleOriginal"
        :options="appStore.formLocales"
        name="collectionLocaleOriginal"
        type="text"
        label="Original Language"
        select-label="Select a Language"
        required
        :error="formErrors.collectionLocaleOriginal"
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
      />
    </div>

    <Button
      size="md"
      has-icon
      type="submit"
    >
      Create Collection
    </Button>
  </form>
</template>
