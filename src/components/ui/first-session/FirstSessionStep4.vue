<script setup lang="ts">
import Word from '@/components/ui/Word.vue'
import WordIndicator from '@/components/ui/WordIndicator.vue'
import { onMounted, onUnmounted, ref } from 'vue'

const targetWord = 'Hund'
const targetWordLenght = '?'.repeat(targetWord.length)
const learnWord = ref(targetWordLenght)
const currentIndex = ref(0)
let interval: number | null | undefined = null

onMounted(() => {
  const loopTime = 1500

  interval = setInterval(() => {
    if (currentIndex.value < targetWord.length) {
      learnWord.value = targetWord.slice(0, currentIndex.value + 1) + '?'.repeat(targetWord.length - (currentIndex.value + 1))
      currentIndex.value++
    } else {
      learnWord.value = targetWordLenght
      currentIndex.value = 0
    }
  }, loopTime)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
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
