<script setup lang="ts">
import SpeechBubble from '@/components/ui/SpeechBubble.vue'
import { CharacterSunray } from '@/configs/assets.config'
import FirstSessionConfig from '@/configs/firstSession.config'
import { useModalStore } from '@/stores/modal.store'
import { useUserStore } from '@/stores/user.store'
import { Bus } from '@/utils/EventBus'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const userStore = useUserStore()
const modalStore = useModalStore()

const activeStepIndex = ref(6)
const activeStep = computed(() => FirstSessionConfig[activeStepIndex.value])
const totalSteps = FirstSessionConfig.length
const stepReady = ref(false)
const collectionUid = ref('')
const wordUid = ref('')

function handleEnableCta() {
  stepReady.value = true
}

function handleSetData(payload: { collectionUid: string, wordUid: string }) {
  collectionUid.value = payload.collectionUid
  wordUid.value = payload.wordUid

  activeStepIndex.value++
  stepReady.value = false
}

function handleClickCta() {
  if (['next', 'validate'].includes(activeStep.value.cta.action)) {
    if (activeStepIndex.value + 1 >= totalSteps) {
      return
    }

    if (activeStep.value.cta.action === 'next') {
      activeStepIndex.value += 1
      return
    }

    if (activeStep.value.cta.action === 'validate' && stepReady.value) {
      Bus.emit('saveStepData', { step: activeStepIndex.value })
    }
  }
}

watch(activeStep, () => {
  stepReady.value = activeStep.value.cta.action === 'next'
}, { immediate: true })

onMounted(() => {
  Bus.on('firstSessionEnableCta', handleEnableCta)
  Bus.on('firstSessionSetData', handleSetData)
})

onUnmounted(() => {
  Bus.off('firstSessionEnableCta', handleEnableCta)
  Bus.off('firstSessionSetData', handleSetData)
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

      <div class="relative mx-auto flex justify-center items-end flex-grow anim-scale-in-timed">
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
      @click="handleClickCta"
    >
      {{ activeStep.cta.text }}
    </Button>
  </div>
</template>
