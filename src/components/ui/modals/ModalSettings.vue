<script setup lang="ts">
import { useSoundStore } from '@/stores/sounds.store'
import { onMounted, ref } from 'vue'

const soundStore = useSoundStore()

const sounds = ref<boolean | undefined>(undefined)
const soundEffects = ref<boolean | undefined>(undefined)

function handleSoundsChange() {
  soundStore.soundsOn = sounds.value as boolean
}

function handleSoundEffectsChange() {
  soundStore.soundEffectsOn = soundEffects.value as boolean
}

onMounted(() => {
  sounds.value = soundStore.soundsOn
  soundEffects.value = soundStore.soundEffectsOn
})
</script>

<template>
  <div class="min-w-40">
    <div class="flex flex-col gap-4 rounded-xl bg-secondary border border-secondary-light p-4">
      <Switch
        v-model="sounds"
        label="Sounds"
        @change="handleSoundsChange"
      />

      <Switch
        v-model="soundEffects"
        label="Sound Effects"
        @change="handleSoundEffectsChange"
      />
    </div>
  </div>
</template>
