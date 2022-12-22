<template>
  <div
    ref="line"
    class="fixed w-full border border-info border-dashed opacity-30"
  />
</template>

<script lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Dash',
  props: {
    boardRef: {
      type: Object,
      default: null
    },
  },
  setup (props) {

    // Injects
    const store = useStore()

    // Refs
    const line = ref(null)
    const offset = computed(() => store.getters['game/offset'])

    // Methods
    const setPosition = () => {
      const boardRect = props.boardRef.board.getBoundingClientRect()
      const lineEl = line.value
      const middleY = (boardRect.height * offset.value / 100)
      lineEl.style.top = `${middleY}px`
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
      window.removeEventListener('resize', handleResize)
    })

    return {
      line,
      handleResize
    }
  }
})
</script>
