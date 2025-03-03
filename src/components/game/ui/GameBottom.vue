<script setup lang="ts">
import { useGameUIStore } from '@/stores/gameUI.store'
import { onMounted, ref } from 'vue'
import GameBottomPowerups from './GameBottomPowerups.vue'

const store = useGameUIStore()

const footerRef = ref<ElementRef>(null)

onMounted(() => {
  if (footerRef.value) {
    store.setElement({ footer: footerRef.value })
  }
})
</script>

<template>
  <div
    ref="footerRef"
    class="absolute flex justify-center w-full bottom-0"
  >
    <div
      id="gameBottom"
      class="bg-secondary border-t border-secondary-light border-l border-r rounded-tl-3xl rounded-tr-3xl px-4"
    >
      <GameBottomPowerups />
    </div>
  </div>
</template>
