<script setup lang="ts">
import Word from '@/components/ui/Word.vue'
import WordIndicator from '@/components/ui/WordIndicator.vue'
import { USER_ACCOUNT_DEFAULTS } from '@/configs/constants'
import SuggestionsLocale from '@/configs/locales/firstSession.locales'
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
  userOriginalLocale?: GameAlphabetLocale | ''
  userLearnLocale?: GameAlphabetLocale | ''
}

const props = withDefaults(defineProps<Props>(), {
  userOriginalLocale: '',
  userLearnLocale: '',
})

const targetOriginalWord = SuggestionsLocale[props.userOriginalLocale as GameAlphabetLocale].wordName
const targetLearnWord = SuggestionsLocale[props.userLearnLocale as GameAlphabetLocale].wordName
const targetLearnWordHidden = '?'.repeat(targetLearnWord.length)

const learnWord = ref(targetLearnWordHidden)
const currentIndex = ref(0)
let interval: number | null | undefined = null

onMounted(() => {
  const loopTime = 1300

  interval = setInterval(() => {
    if (currentIndex.value < targetLearnWord.length) {
      learnWord.value = targetLearnWord.slice(0, currentIndex.value + 1) + '?'.repeat(targetLearnWord.length - (currentIndex.value + 1))
      currentIndex.value++
    } else {
      learnWord.value = targetLearnWordHidden
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
          :country-code="userOriginalLocale"
          :word="targetOriginalWord"
        />
        <WordIndicator
          text="Your Language"
          class="border-senary bg-secondary-light"
        />
      </div>

      <div class="flex w-full justify-between gap-4">
        <Word
          :country-code="userLearnLocale"
          :word="learnWord"
        />
        <WordIndicator
          text="Learn Language"
          class="border-tertiary-light bg-tertiary"
        />
      </div>
    </div>
  </div>

  <p class="mt-16 mb-4">
    I'll give you some lives to get started!
  </p>

  <div class="relative p-4 rounded-2xl border border-secondary bg-secondary-dark anim-scale-in-timed">
    <p class="text-xs pb-2">
      DOT gifted you
    </p>

    <div class="flex w-full justify-center items-center gap-3">
      <Icon
        name="heart-full"
        size="xl"
      />

      <p class="text-2xl text-quaternary-light">
        <span class="">{{ USER_ACCOUNT_DEFAULTS.lives }}</span> lives
      </p>
    </div>
  </div>
</template>
