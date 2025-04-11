<script setup lang="ts">
import PageContent from '@/components/ui//PageContent.vue'
import SpeechBubble from '@/components/ui/SpeechBubble.vue'
import { CharacterSunray } from '@/configs/assets.config'
import FirstSessionConfig from '@/configs/firstSession.config'
import { Bus } from '@/services/EventBusService'
import APIService from '@/services/LocalStorageService'
import { isMobile } from '@/utils'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['change'])

const router = useRouter()

const userNativeLocaleCode = ref<AppLocaleCode | null>(null)
const userLearnLocaleCode = ref<AppLocaleCode | null>(null)
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

function handleDisableCta() {
  stepReady.value = false
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
      userNativeLocaleCode.value = payload.userLocaleOriginalCode as AppLocaleCode
    } else if (payload.userLocaleLearnCode) {
      userLearnLocaleCode.value = payload.userLocaleLearnCode as AppLocaleCode
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
  Bus.on('firstSessionDisableCta', handleDisableCta)
  Bus.on('firstSessionGotoNextStep', handleSetData)
})

onUnmounted(() => {
  Bus.off('firstSessionEnableCta', handleEnableCta)
  Bus.off('firstSessionDisableCta', handleDisableCta)
  Bus.off('firstSessionGotoNextStep', handleSetData)
})
</script>

<template>
  <div class="w-full h-full pt-16 pb-1 flex flex-col gap-8">
    <div class="flex flex-col gap-4 h-full">
      <SpeechBubble
        :text-top="activeStep.text.top"
        :text-bottom="activeStep.text.bottom"
        class="anim-scale-in-timed mx-4"
      />

      <PageContent
        :is-empty="false"
        overflow="hidden"
      >
        <div
          v-if="activeStep.asset"
          class="relative mx-auto flex justify-center items-end flex-grow anim-scale-in-timed"
        >
          <img
            :src="CharacterSunray"
            class="block opacity-50 xs:w-[140px] xs:h-[140px]"
            width="180"
            height="180"
          >

          <img
            v-if="activeStep.bgAsset"
            :src="activeStep.bgAsset.name"
            :class="activeStep.bgAsset.className"
            width="200"
            height="120"
            class="absolute sm:w-[200px] sm:h-[120px] opacity-40 transition-transform bottom-0 left-1/2 -translate-x-1/2 -translate-y-7 sm:-translate-y-8"
          >

          <img
            :src="activeStep.asset.name"
            :class="activeStep.asset.className"
            width="112"
            height="112"
            class="absolute xs:w-20 sm:w-28 transition-transform bottom-0 left-1/2 -translate-x-1/2 -translate-y-7 sm:-translate-y-8"
          >

          <div
            v-if="activeStep.icon"
            class="absolute bottom-0 right-0 -translate-x-1/2 -translate-y-1/2"
          >
            <div class="flex items-center justify-center rounded-full bg-senary-dark border border-senary-light w-9 h-9">
              <Icon
                :size="isMobile() ? 'sm' : 'md'"
                :type="activeStep.icon.type || 'stroke'"
                :name="activeStep.icon.name"
                :color="activeStep.icon.color"
                class="anim-scale-in-timed"
              />
            </div>
          </div>
        </div>

        <div class="mx-4">
          <Component
            :is="activeStep.content"
            v-if="activeStep.content"
            :user-original-locale="userNativeLocaleCode"
            :user-learn-locale="userLearnLocaleCode"
            :step-id="activeStep.id"
          />
        </div>

        <template #footer>
          <Button
            size="md"
            has-icon
            class="w-full mx-4"
            :disabled="!stepReady"
            :border-color="activeStep.cta.color ? `${activeStep.cta.color}-light` : 'primary-light'"
            :background-color="activeStep.cta.color || 'primary'"
            @keydown.enter="handleClickCta"
            @click="handleClickCta"
          >
            {{ $t(activeStep.cta.text) }}
          </Button>
        </template>
      </PageContent>
    </div>
  </div>
</template>
