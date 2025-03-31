<script setup lang="ts">
import SuggestionsLocale from '@/configs/locales/firstSession.locales'

interface Props {
  userOriginalLocale?: GameAlphabetLocale | ''
  userLearnLocale?: GameAlphabetLocale | ''
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: 'name',
  userOriginalLocale: '',
  userLearnLocale: '',
})

const emit = defineEmits(['click'])

function handleSetSuggestionName() {
  const suggestionOriginal = SuggestionsLocale[props.userOriginalLocale as GameAlphabetLocale]
  const suggestionLearn = SuggestionsLocale[props.userLearnLocale as GameAlphabetLocale]

  emit('click', {
    collectionName: suggestionOriginal?.collectionName,
    wordOriginalName: suggestionOriginal?.wordName,
    wordLearnName: suggestionLearn?.wordName,
  })
}
</script>

<template>
  <div>
    <p class="my-4 text-sm">
      Can't think of a {{ text }}?
    </p>

    <Button
      size="sm"
      background-color="transparent"
      border-color="secondary-light"
      @click="handleSetSuggestionName"
    >
      Get a suggestion
    </Button>
  </div>
</template>
