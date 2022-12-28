<template>
  <section class="ui-game-overlay">
    <div class="ui-game-overlay__wrapper">
      <div class="ui-game-overlay__bg" />
      <div class="ui-game-overlay__content">
        <component :is="component" />
      </div>
    </div>
    adsa
  </section>
</template>

<script lang="ts">
import { onBeforeMount, defineComponent } from 'vue'
import UiGameOverlayInitCount from './UiGameOverlayInitCount.vue'

export default defineComponent({
  name: 'UiGameOverlay',
  components: {
    UiGameOverlayInitCount
  },
  setup() {
    // const states = {
    //   fadeIn,
    //   visible,
    //   fadeOut,
    //   hidden
    // }

    const component = 'UiGameOverlayInitCount'

    onBeforeMount(() => {

    })

    return {
      component
    }
  }
})
</script>

<style scoped>
.ui-game-overlay {
  @apply w-full h-full absolute left-0 top-0;
}

.ui-game-overlay__wrapper {
  @apply relative w-full h-full;
}

.ui-game-overlay__bg {
  @apply z-0 absolute w-full h-full bg-secondary opacity-70 left-0 top-0;
}

.ui-game-overlay__content {
  @apply z-10 flex items-center justify-center relative w-full h-full;
}
</style>