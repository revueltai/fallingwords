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
 @apply z-10 rounded-2xl border border-quinary bg-tertiary p-40 text-center; 
 width: 340px;
 max-height: 400px;
 animation: slide-in-top .2s ease-in-out;
}

.ui-game-overlay-content__heading {
  @apply text-2xl mb-48; 
  animation: slide-fade-in-bottom .4s ease-in-out both;
  animation-delay: .2s;
}

.ui-game-overlay-content__footer {
  @apply flex items-center justify-center gap-16; 
}

.slot__left,
.slot__center,
.slot__right {
  animation: slide-fade-in-top .2s ease-in both;
}

.slot__left {
  animation-delay: .1s;
}

.slot__center {
  animation-delay: .2s;
}

.slot__right {
  animation-delay: .3s;
}
</style>