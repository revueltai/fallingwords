<script setup lang="ts">
interface Props {
  heading: string
}

withDefaults(defineProps<Props>(), {
  heading: ''
})
</script>

<template>
  <div class="relative z-10 rounded-2xl border border-quinary bg-tertiary p-40 text-center overlay-content">
    <h2 class="text-3xl mb-6 content__heading">
      {{ heading }}
    </h2>

    <slot />

    <div class="flex items-center justify-center gap-4 mt-32 content__footer">
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

<style scoped>
.overlay-content {
  width: 340px;
  max-height: 440px;
  animation: scaleIn .4s ease-in-out;
}

.content__heading {
  animation: slideFadeInBottom .4s ease-in-out both;
  animation-delay: .2s;
}

.content__footer {
  animation: slideFadeInTop .4s ease-in both;
}
</style>
