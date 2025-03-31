<script setup lang="ts">
import Word from '@/components/ui/Word.vue'
import WordIndicator from '@/components/ui/WordIndicator.vue'
import SuggestionsLocale from '@/configs/locales/firstSession.locales'

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
          :word="targetLearnWordHidden"
        />
        <WordIndicator
          text="Learn Language"
          class="border-tertiary-light bg-tertiary"
        />
      </div>
    </div>
  </div>
</template>
