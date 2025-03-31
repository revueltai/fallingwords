<script setup lang="ts">
import Word from '@/components/ui/Word.vue'
import WordIndicator from '@/components/ui/WordIndicator.vue'
import { onMounted, ref } from 'vue'

const learnWord = ref('????')

onMounted(() => {
  setTimeout(() => {
    learnWord.value = 'H???'
  }, 1500)
})
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
          :word="learnWord"
        />
        <WordIndicator
          text="Learn Language"
          class="border-tertiary-light bg-tertiary"
        />
      </div>
    </div>
  </div>
</template>
