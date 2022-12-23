<template>
  <div
    ref="line"
    class="dash-line"
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
    const offset = computed(() => store.getters['gameCharacter/offset'])

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
        window.addEventListener('resize', handleResize, false)
        handleResize()
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

<style scoped>
.dash-line {
  @apply absolute w-full border border-info border-dashed opacity-30;
}
</style>
