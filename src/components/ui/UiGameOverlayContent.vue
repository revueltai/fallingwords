<template>
  <div class="ui-game-overlay-content">
    <h2 class="ui-game-overlay-content__heading">
      {{ heading }}
    </h2>
    
    <slot />

    <div class="ui-game-overlay-content__footer">
      <div class="slot__left">
        <slot name="footerLeft" />
      </div>

      <div class="slot__center">
        <slot name="footerCenter" />
      </div>
      
      <div class="slot__right">
        <slot name="footerRight" />
      </div>
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
 @apply relative z-10 rounded-2xl border border-quinary bg-tertiary p-40 text-center; 
 width: 340px;
 max-height: 440px;
 animation: scale-in .4s ease-in-out;
}

.ui-game-overlay-content__heading {
  @apply text-3xl mb-24; 
  animation: slide-fade-in-bottom .4s ease-in-out both;
  animation-delay: .2s;
}

.ui-game-overlay-content__footer {
  @apply flex items-center justify-center gap-16 mt-32; 
  animation: slide-fade-in-top .4s ease-in both;
}
</style>