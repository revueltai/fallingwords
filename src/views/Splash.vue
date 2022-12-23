<template>
  <section class="splash">
    <div>
      <h1>Fallingwords</h1>

      <cbutton to="game">
        Start
      </cbutton>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Splash'
})
</script>

<style scoped>
.splash {
  @apply absolute flex items-center justify-center bg-primary w-full h-full text-center;
}

.splash h1 {
  @apply text-3xl mb-32;
}
</style>