<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import { onMounted, ref } from 'vue'

const props = defineProps<{ uid: string }>()

const emit = defineEmits(['update'])

const appStore = useAppStore()

const collectionName = ref('')
const collectionLocaleOriginal = ref('')
const collectionLocaleLearn = ref('')

onMounted(async () => {
  await appStore.setFormLocales()
  const collection = await appStore.getCollectionById(props.uid)

  if (collection) {
    collectionName.value = collection.name
    collectionLocaleOriginal.value = String(collection.locales.original)
    collectionLocaleLearn.value = String(collection.locales.learn)
  }
})
</script>

<template>
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
      name="collectionLocaleOriginal"
      type="text"
      :required="true"
      :label="$t('nativeLanguage')"
      :select-label="$t('nativeLanguage')"
    />

    <Select
      v-model="collectionLocaleLearn"
      :options="appStore.formLocales"
      name="collectionLocaleLearn"
      type="text"
      :label="$t('learnLanguage')"
      :select-label="$t('learnLanguage')"
    />
  </div>

  <Button
    size="md"
    has-icon
    @click="emit('update', {
      uid,
      name: collectionName,
      localeOriginal: collectionLocaleOriginal,
      localeLearn: collectionLocaleLearn,
    })"
  >
    {{ $t('saveChanges') }}
  </Button>
</template>
