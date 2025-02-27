<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import { useGameBoardStore } from '@/stores/gameBoard.store'
import { useGameUIStore } from '@/stores/gameUI.store'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const appStore = useAppStore()
const gameBoardStore = useGameBoardStore()
const gameUIStore = useGameUIStore()

const boardRef = ref<HTMLElement | null>(null)
const UIElementsHeight = computed(() => gameUIStore.elementsHeight)
const canvasEl = computed(() => appStore.canvasEl)

function setPosition() {
  if (
    boardRef.value
    && canvasEl.value
    && UIElementsHeight.value
  ) {
    const canvasRect: DOMRect = canvasEl.value.getBoundingClientRect()
    const boardHeight: number = canvasRect.height - UIElementsHeight.value.header - UIElementsHeight.value.footer
    const boardWidth: number = canvasRect.width

    boardRef.value.style.top = `${UIElementsHeight.value.header}px`
    boardRef.value.style.width = `${boardWidth}px`
    boardRef.value.style.height = `${boardHeight}px`
  }
}

function handleResize() {
  setPosition()
}

function initialize() {
  nextTick(() => {
    handleResize()
    window.addEventListener('resize', handleResize, false)

    if (boardRef.value) {
      gameBoardStore.setElement(boardRef.value)
    }
  })
}

onMounted (() => initialize())

onBeforeUnmount (() => window.removeEventListener('resize', handleResize, false))
</script>

<template>
  <div
    ref="boardRef"
    class="absolute bg-transparent left-0 pointer-events-none"
  />
</template>
