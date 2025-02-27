<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount, defineComponent } from 'vue'
import { useGameCharacterStore } from '@/stores/gameCharacter.store'
import { useGameBoardStore } from '@/stores/gameBoard.store'

const store = useGameCharacterStore()
const gameBoardStore = useGameBoardStore()

const lineRef = ref<HTMLElement | null>(null)
const offset = computed(() => store.offset)

const setPosition = () => {
  const boardRect: DOMRect = gameBoardStore.boardEl!.getBoundingClientRect()
  const posY: number = (boardRect.height * offset.value / 100)

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
    <div class="border border-info border-dashed opacity-30" />
  </div>
</template>

<style scoped>
.dash-line {
  --anim-offset: 8px;
  animation: slide-fade-in-bottom .5s ease-in-out backwards;
}
</style>
