<script setup lang="ts">
import { useSoundStore } from '@/stores/sounds.store'
import { ref } from 'vue'

const soundStore = useSoundStore()

const sounds = ref<boolean | undefined>(soundStore.soundsOn)
const soundEffects = ref<boolean | undefined>(soundStore.soundEffectsOn)

function handleSoundsChange() {
  soundStore.updateSoundSetting(sounds.value as boolean)

  if (soundStore.soundsOn) {
    soundStore.playLoopSound(soundStore.soundActive)
  } else {
    soundStore.stopLoopSound()
  }
}

function handleSoundEffectsChange() {
  soundStore.updateSoundEffectsSetting(soundEffects.value as boolean)
}
</script>

<template>
  <div class="flex flex-col gap-4 rounded-xl bg-secondary border border-secondary-light p-4 w-full">
    <Switch
      v-model="sounds"
      label="Music"
      @change="handleSoundsChange"
    />

    <Switch
      v-model="soundEffects"
      label="Sound Effects"
      @change="handleSoundEffectsChange"
    />
  </div>
</template>
