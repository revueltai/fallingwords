<template>
  <div
    ref="board"
    class="board"
  />
</template>

<script lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Board',
  setup () {

    // Injects
    const store = useStore()

    // Refs
    const board = ref(null)

    // Methods
    const setPosition = () => {
      const boardEl = board.value
      const UIElementsHeight = store.getters['game/uiElementsHeight']
      const canvasEl = store.getters['app/canvasEl']
      const canvasHeight: number = canvasEl.getBoundingClientRect().height
      const boardHeight: number = canvasHeight - UIElementsHeight.header - UIElementsHeight.footer

      boardEl.style.top = `${UIElementsHeight.header}px`
      boardEl.style.height = `${boardHeight}px`
    }

    // Event Handlers
    const handleResize = (() => {
      setPosition()
    })

    // Hooks
    onMounted (() => {
      nextTick(() => {
        handleResize()
        window.addEventListener('resize', handleResize, false)
      })
    })

    onBeforeUnmount (() => {
      window.removeEventListener('resize', handleResize, false)
    })

    return {
      board,
      handleResize
    }
  }
})
</script>

<style scoped>
.board {
  @apply absolute w-full bg-transparent top-0 h-24;
}
</style>