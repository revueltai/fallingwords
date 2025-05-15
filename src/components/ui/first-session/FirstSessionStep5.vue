<script setup lang="ts">
import FirstSessionDotGift from '@/components/ui/first-session/FirstSessionDotGift.vue'
import Word from '@/components/ui/Word.vue'
import WordIndicator from '@/components/ui/WordIndicator.vue'
import { USER_ACCOUNT_DEFAULTS } from '@/configs/constants'
import SuggestionsLocale from '@/configs/locales/firstSession.locales'
import { handleWordReveal } from '@/utils'
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
  userOriginalLocale?: AppLocaleCode | ''
  userLearnLocale?: AppLocaleCode | ''
  stepId?: string
}

const props = withDefaults(defineProps<Props>(), {
  userOriginalLocale: '',
  userLearnLocale: '',
})

const targetOriginalWord = SuggestionsLocale[props.userOriginalLocale as AppLocaleCode].wordName
const targetLearnWord = SuggestionsLocale[props.userLearnLocale as AppLocaleCode].wordName
const targetLearnWordHidden = '?'.repeat(targetLearnWord.word.length)

const learnWord = ref(targetLearnWordHidden)
const currentIndex = ref(0)
let interval: NodeJS.Timeout | null | undefined = null

onMounted(() => {
  interval = setInterval(() => {
    const { currentWord, currentIndex: newIndex } = handleWordReveal(
      targetLearnWord.word,
      targetLearnWordHidden,
      currentIndex.value,
    )

    learnWord.value = currentWord
    currentIndex.value = newIndex
  }, 1300)
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
          :article="targetOriginalWord.article"
          :word="targetOriginalWord.word"
        />

        <WordIndicator
          :text="$t('yourLanguage')"
          class="border-senary bg-secondary-light"
        />
      </div>

      <div class="flex w-full justify-between gap-4">
        <Word
          :country-code="userLearnLocale"
          :article="targetLearnWord.article"
          :word="learnWord"
        />

        <WordIndicator
          :text="$t('learnLanguage')"
          class="border-tertiary-light bg-tertiary"
        />
      </div>
    </div>
  </div>

  <FirstSessionDotGift
    :amount="USER_ACCOUNT_DEFAULTS.lives"
    :heading="$t('starterLives')"
    icon-name="heart-full"
    item-name="Lives"
    class="mt-12"
    text-color="quaternary-light"
  />
</template>
