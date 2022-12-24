<template>
  <div
    ref="board"
    class="board"
  />
</template>

<script lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Board',
  setup () {

    // Injects
    const store = useStore()

    // Refs
    const board = ref(null)
    const UIElementsHeight = computed(() => store.getters['game/uiElementsHeight'])
    const canvasEl = computed(() => store.getters['app/canvasEl'])

    // Methods
    const setPosition = () => {
      const boardEl = board.value      
      const canvasRect: DOMRect = canvasEl.value.getBoundingClientRect()
      const boardHeight: number = canvasRect.height - UIElementsHeight.value.header - UIElementsHeight.value.footer
      const boardWidth: number = canvasRect.width

      boardEl.style.top = `${UIElementsHeight.value.header}px`
      boardEl.style.width = `${boardWidth}px`
      boardEl.style.height = `${boardHeight}px`
    }

    // Event Handlers
    const handleResize = (() => {
      setPosition()
    })

    const initialize = () => {    
      nextTick(() => {        
        handleResize()
        window.addEventListener('resize', handleResize, false)
        store.dispatch('gameBoard/setElement', board.value)      
      })
    }

    // Hooks
    onMounted (() => {
      initialize()      
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
  @apply absolute bg-transparent;
}
</style>