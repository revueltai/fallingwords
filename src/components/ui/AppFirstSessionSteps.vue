<script setup lang="ts">
import SpeechBubble from '@/components/ui/SpeechBubble.vue'
import { CharacterSunray } from '@/configs/assets.config'
import FirstSessionConfig from '@/configs/firstSession.config'
import { useModalStore } from '@/stores/modal.store'
import { useUserStore } from '@/stores/user.store'
import { computed, ref } from 'vue'

const userStore = useUserStore()
const modalStore = useModalStore()

const activeStepIndex = ref(3)
const activeStep = computed(() => {
  return FirstSessionConfig[activeStepIndex.value]
})
const totalSteps = FirstSessionConfig.length

function handleClickStepCta() {
  if (activeStep.value.cta.action === 'next') {
    if (activeStepIndex.value + 1 >= totalSteps) {
      return
    }

    activeStepIndex.value += 1
  }
}
</script>

<template>
  <div class="w-full h-full pt-16 pb-1 flex flex-col gap-8">
    <div class="flex flex-col gap-8">
      <SpeechBubble
        :text-top="activeStep.text.top"
        :text-bottom="activeStep.text.bottom"
        class="anim-scale-in-timed"
      />

      <div class="relative mx-auto flex justify-center items-center flex-grow anim-scale-in-timed">
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
          class="absolute transition-transform"
        >

        <div
          v-if="activeStep.icon"
          class="absolute bottom-0 right-0 -translate-x-1/2 -translate-y-1"
        >
          <div
            class="p-3 rounded-full bg-senary-dark border border-senary-light"
            :class="activeStep.icon.className"
          >
            <Icon
              size="md"
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
        <component :is="activeStep.content" />
      </div>
    </div>

    <Button
      size="md"
      has-icon
      class="mt-auto"
      @click="handleClickStepCta"
    >
      {{ activeStep.cta.text }}
    </Button>
  </div>
</template>
