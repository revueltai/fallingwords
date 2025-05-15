<script setup lang="ts">
interface Props {
  word: string
  countryCode: string
  article?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex gap-2 items-center">
    <Flag :country-code="countryCode" />

    <h3 class="text-white truncate max-w-28 text-sm sm:text-p md:max-w-none">
      <span
        v-if="article"
        class="text-grey"
      >
        {{ article }}
      </span>

      {{ word }}
    </h3>
  </div>
</template>
