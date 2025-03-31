<script setup lang="ts">
import Word from '@/components/ui/Word.vue'
import WordIndicator from '@/components/ui/WordIndicator.vue'
</script>

<template>
  <div class="relative p-4 rounded-2xl border border-secondary bg-secondary-dark">
    <div class="flex flex-col gap-4">
      <div class="flex w-full justify-between gap-4">
        <Word
          country-code="en"
          word="Dog"
        />
        <WordIndicator
          text="Your Language"
          class="border-senary bg-secondary-light"
        />
      </div>

      <div class="flex w-full justify-between gap-4">
        <Word
          country-code="de"
          word="????"
        />
        <WordIndicator
          text="Learn Language"
          class="border-tertiary-light bg-tertiary"
        />
      </div>
    </div>
  </div>
</template>
