<script setup lang="ts">
import SuggestionsLocale from '@/configs/locales/firstSession.locales'

interface Props {
  userOriginalLocale?: AppLocaleCode | ''
  userLearnLocale?: AppLocaleCode | ''
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: 'name',
  userOriginalLocale: '',
  userLearnLocale: '',
})

const emit = defineEmits(['click'])

function handleSetSuggestionName() {
  const suggestionOriginal = SuggestionsLocale[props.userOriginalLocale as AppLocaleCode]
  const suggestionLearn = SuggestionsLocale[props.userLearnLocale as AppLocaleCode]

  emit('click', {
    collectionName: suggestionOriginal?.collectionName,
    wordOriginalName: suggestionOriginal?.wordName,
    wordLearnName: suggestionLearn?.wordName,
  })
}
</script>

<template>
  <div>
    <p class="mt-4 mb-2 text-sm">
      {{ $t('CantThinkOfA') }} {{ text }}?
    </p>

    <Button
      size="sm"
      background-color="transparent"
      border-color="secondary-light"
      @click="handleSetSuggestionName"
    >
      {{ $t('getASuggestion') }}
    </Button>
  </div>
</template>
