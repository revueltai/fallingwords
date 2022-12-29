<template>
  <div
    ref="pauseRef"
  >
    <div>
      paused
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { UI } from '../../configs/constants'

export default defineComponent({
  name: 'UiGameOverlayPause',
  setup() {
    // Injects
    const store = useStore()

    onMounted(() => {
      store.dispatch('gameUI/setOverlayState', UI.overlayStates.fadeIn)
    })
  }
})
</script>