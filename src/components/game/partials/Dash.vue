<script setup lang="ts">
import { useGameBoardStore } from '@/stores/gameBoard.store'
import { useGameCharacterStore } from '@/stores/gameCharacter.store'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const store = useGameCharacterStore()
const gameBoardStore = useGameBoardStore()

const lineRef = ref<ElementRef>(null)
const offset = computed(() => store.offset)

function setPosition() {
  const boardRect = gameBoardStore.boardEl!.getBoundingClientRect()
  const posY = (boardRect.height * offset.value / 100)

  lineRef.value!.style.top = `${posY}px`
}

function handleResize() {
  setPosition()
}

onMounted(() => {
  nextTick(() => {
    window.addEventListener('resize', handleResize, false)
    handleResize()
  })
})

onBeforeUnmount(() => window.removeEventListener('resize', handleResize))
</script>

<template>
  <div
    ref="lineRef"
    class="absolute w-full dash-line"
  >
    <div class="border border-senary border-dashed opacity-30" />
  </div>
</template>

<style scoped>
.dash-line {
  --anim-offset: 8px;
  animation: slide-fade-in-bottom .5s ease-in-out backwards;
}
</style>
