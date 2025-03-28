<script setup lang="ts">
interface Props {
  heading: string
  subheading: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-2">
    <h2 class="text-2xl text-white">
      {{ heading }}
    </h2>

    <p class="text-primary text-sm">
      {{ subheading }}
    </p>
  </div>
</template>
