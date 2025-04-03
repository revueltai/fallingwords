<script setup lang="ts">
import SpeechBubble from '@/components/ui/SpeechBubble.vue'
import { CharacterSunray } from '@/configs/assets.config'
import FirstSessionConfig from '@/configs/firstSession.config'
import APIService from '@/utils/apiService'
import { Bus } from '@/utils/EventBus'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['change'])

const router = useRouter()

const userNativeLocaleCode = ref<GameAlphabetLocale | null>(null)
const userLearnLocaleCode = ref<GameAlphabetLocale | null>(null)
const collectionUid = ref('')
const activeStepIndex = ref(0)
const stepReady = ref(false)

const activeStep = computed(() => FirstSessionConfig[activeStepIndex.value])

function updateCompletitionPercentage() {
  emit('change', Math.floor((activeStepIndex.value * 100) / FirstSessionConfig.length))
}

function handleEnableCta() {
  stepReady.value = true
}

async function handleGetData() {
  setTimeout(() => Bus.emit('firstSessionSetStepData', collectionUid.value), 1000)
}

async function handleSetData(payload: {
  collectionUid?: string
  userLocaleOriginalCode?: string
  userLocaleLearnCode?: string
} | null = null) {
  if (payload) {
    if (payload.collectionUid) {
      collectionUid.value = payload.collectionUid
    } else if (payload.userLocaleOriginalCode) {
      userNativeLocaleCode.value = payload.userLocaleOriginalCode as GameAlphabetLocale
    } else if (payload.userLocaleLearnCode) {
      userLearnLocaleCode.value = payload.userLocaleLearnCode as GameAlphabetLocale
    }
  }

  activeStepIndex.value++
  updateCompletitionPercentage()
  stepReady.value = false
}

function handleClickCta() {
  if (['next', 'validate'].includes(activeStep.value.cta.action)) {
    if (activeStep.value.cta.action === 'next') {
      activeStepIndex.value += 1
      updateCompletitionPercentage()
      return
    }

    if (activeStep.value.cta.action === 'validate' && stepReady.value) {
      Bus.emit('firstSessionSaveStepData', { stepId: activeStep.value.id })
    }

    return
  }

  if (activeStep.value.cta.action === 'end') {
    router.push({ name: 'Dashboard' })
  }
}

watch(activeStep, () => {
  stepReady.value = ['next', 'end'].includes(activeStep.value.cta.action)
}, { immediate: true })

onMounted(() => {
  APIService.clearAllStoresAppData()
  Bus.on('firstSessionGetData', handleGetData)
  Bus.on('firstSessionEnableCta', handleEnableCta)
  Bus.on('firstSessionGotoNextStep', handleSetData)
})

onUnmounted(() => {
  Bus.off('firstSessionEnableCta', handleEnableCta)
  Bus.off('firstSessionGotoNextStep', handleSetData)
})
</script>

<template>
  <div class="w-full h-full pt-16 pb-1 flex flex-col gap-8">
    <div class="flex flex-col gap-8">
      <SpeechBubble
        :text-top="activeStep.text.top"
        :text-bottom="activeStep.text.bottom"
        class="anim-scale-in-timed"
      />

      <div
        v-if="activeStep.asset"
        class="relative mx-auto flex justify-center items-end flex-grow anim-scale-in-timed"
      >
        <img
          :src="CharacterSunray"
          class="block opacity-50 w-24 h-24 sm:w-[180px] sm:h-[180px]"
          width="180"
          height="180"
        >

        <img
          v-if="activeStep.bgAsset"
          :src="activeStep.bgAsset.name"
          :class="activeStep.bgAsset.className"
          width="200"
          height="120"
          class="absolute sm:w-[200px] sm:h-[120px] opacity-40 transition-transform bottom-0 left-1/2 -translate-x-1/2 sm:-translate-y-8"
        >

        <img
          :src="activeStep.asset.name"
          :class="activeStep.asset.className"
          width="112"
          height="112"
          class="absolute xs:w-20 xs:h-20 sm:w-28 transition-transform bottom-0 left-1/2 -translate-x-1/2 -translate-y-8"
        >

        <div
          v-if="activeStep.icon"
          class="absolute bottom-0 right-0 -translate-x-1/2 -translate-y-1/2"
        >
          <div class="p-3 rounded-full bg-senary-dark border border-senary-light">
            <Icon
              size="md"
              :type="activeStep.icon.type || 'stroke'"
              :name="activeStep.icon.name"
              :color="activeStep.icon.color"
              class="anim-scale-in-timed"
            />
          </div>
        </div>
      </div>

      <div
        v-if="activeStep.content"
        class="mt-4"
      >
        <Component
          :is="activeStep.content"
          :enable-cta="handleEnableCta"
          :user-original-locale="userNativeLocaleCode"
          :user-learn-locale="userLearnLocaleCode"
          :step-id="activeStep.id"
        />
      </div>
    </div>

    <Button
      size="md"
      has-icon
      class="mt-auto"
      :disabled="!stepReady"
      :border-color="activeStep.cta.color ? `${activeStep.cta.color}-light` : 'primary-light'"
      :background-color="activeStep.cta.color || 'primary'"
      @click="handleClickCta"
    >
      {{ activeStep.cta.text }}
    </Button>
  </div>
</template>
