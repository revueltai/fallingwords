<template>
  <div class="ui-game-overlay-content anim-slide-in-bottom">
    <h2 class="ui-game-overlay-content__heading">
      {{ heading }}
    </h2>
    
    <slot />

    <div class="ui-game-overlay-content__footer">
      <slot name="footerLeft" />
      <slot name="footerCenter" />
      <slot name="footerRight" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UiGameOverlayContent',
  props: {
    heading: {
      type: String,
      default: ''
    }
  }
})
</script>

<style scoped>
.ui-game-overlay-content {
 @apply z-10 rounded-2xl border border-quinary bg-tertiary p-40 text-center; 
 width: 340px;
 max-height: 400px;
}

.ui-game-overlay-content__heading {
  @apply text-2xl mb-48; 
}

.ui-game-overlay-content__footer {
  @apply flex items-center justify-center gap-16; 
}
</style>