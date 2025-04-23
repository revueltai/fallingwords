<script setup lang="ts">
import { Bus } from '@/services/EventBusService'
import { useAppStore } from '@/stores/app.store'
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
  stepId: string
}

const props = defineProps<Props>()

const appStore = useAppStore()

const userLocaleOriginal = ref('')

const formErrors = ref({
  userLocaleOriginal: '',
})

function validateForm(): boolean {
  return !!userLocaleOriginal.value
}

async function handleValidate(event: Event) {
  event.preventDefault()

  if (validateForm()) {
    Bus.emit('firstSessionEnableCta')
  }
}

async function handleStoreData() {
  if (props.stepId !== 'nativeLocalePrompt') {
    return
  }

  Bus.emit('firstSessionGotoNextStep', { userLocaleOriginalCode: userLocaleOriginal.value })
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
      <Select
        v-model="userLocaleOriginal"
        :asset="userLocaleOriginal"
        :options="appStore.formLocales"
        name="userNativeLocale"
        :label="$t('nativeLanguage')"
        :select-label="$t('selectLanguage')"
        required
        :error="formErrors.userLocaleOriginal"
        @change="handleValidate"
      />
    </div>
  </form>
</template>
