<script setup lang="ts">
import SpeechBubble from '@/components/ui/SpeechBubble.vue'
import { CharacterSunray } from '@/configs/assets.config'
import FirstSessionConfig from '@/configs/firstSession.config'
import APIService from '@/utils/apiService'
import { Bus } from '@/utils/EventBus'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const collectionUid = ref('')
const activeStepIndex = ref(0)
const activeStep = computed(() => FirstSessionConfig[activeStepIndex.value])
const stepReady = ref(false)

function handleEnableCta() {
  stepReady.value = true
}

async function handleGetData() {
  setTimeout(() => Bus.emit('firstSessionSetStepData', collectionUid.value), 1000)
}

async function handleSetData(payload: { collectionUid: string, wordUid: string } | null = null) {
  if (payload) {
    collectionUid.value = payload.collectionUid
  }

  activeStepIndex.value++
  stepReady.value = false
}

function handleClickCta() {
  if (['next', 'validate'].includes(activeStep.value.cta.action)) {
    if (activeStep.value.cta.action === 'next') {
      activeStepIndex.value += 1
      return
    }

    if (activeStep.value.cta.action === 'validate' && stepReady.value) {
      Bus.emit('firstSessionSaveStepData', { step: activeStepIndex.value })
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
          class="block opacity-50"
          width="180"
          height="180"
        >

        <img
          :src="activeStep.asset.name"
          :class="activeStep.asset.className"
          width="112"
          height="112"
          class="absolute transition-transform bottom-0 left-1/2 -translate-x-1/2 -translate-y-8"
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
        <component
          :is="activeStep.content"
          :enable-cta="handleEnableCta"
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
