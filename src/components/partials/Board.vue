<template>
  <div
    ref="board"
    class="fixed w-full bg-transparent top-0 h-24"
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
      const documentHeight: number = document.documentElement.getBoundingClientRect().height
      const boardHeight: number = documentHeight - UIElementsHeight.header - UIElementsHeight.footer

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
