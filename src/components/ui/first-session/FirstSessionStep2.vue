<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import { Bus } from '@/utils/EventBus'
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Props {
  stepId: string
  userOriginalLocale: GameAlphabetLocale
}

const props = defineProps<Props>()

const appStore = useAppStore()

const userLocaleLearn = ref('')

const formErrors = ref({ userLocaleLearn: '' })

const sanitizedOptions = computed(() => {
  return appStore.formLocales.filter((option: FormSelectOption) => option.value !== props.userOriginalLocale)
})

function validateForm(): boolean {
  return !!userLocaleLearn.value
}

async function handleValidate(event: Event) {
  event.preventDefault()

  if (validateForm()) {
    Bus.emit('firstSessionEnableCta')
  }
}

async function handleStoreData() {
  if (props.stepId !== 'learnLocalePrompt') {
    return
  }

  Bus.emit('firstSessionGotoNextStep', { userLocaleLearnCode: userLocaleLearn.value })
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
        v-model="userLocaleLearn"
        :options="sanitizedOptions"
        name="userLearnLocale"
        label="Learn Language"
        select-label="Select a Language"
        required
        :error="formErrors.userLocaleLearn"
        @change="handleValidate"
      />
    </div>
  </form>

  <p class="text-sm text-septenary-dark flex justify-center gap-2">
    <Icon
      name="info"
      size="sm"
      color="septenary-dark"
      type="stroke"
    />

    You can select more Learn languages later.
  </p>
</template>
