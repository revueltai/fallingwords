<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import { isMobile } from '@/utils'
import { Bus } from '@/services/EventBusService'
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Props {
  stepId: string
  userOriginalLocale: AppLocaleCode
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
    <div class="mb-8 flex flex-col gap-2">
      <Select
        v-model="userLocaleLearn"
        :options="sanitizedOptions"
        name="userLearnLocale"
        :label="$t('learnLanguage')"
        :select-label="$t('selectLanguage')"
        required
        :error="formErrors.userLocaleLearn"
        @change="handleValidate"
      />

      <p class="flex items-center justify-center gap-2 text-xs sm:text-sm">
        <Icon
          name="info"
          :size="isMobile() ? 'xs' : 'sm'"
          type="stroke"
        />

        {{ $t('infoSelectLearnLanguages') }}
      </p>
    </div>
  </form>
</template>
