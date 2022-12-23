<template>
  <div
    ref="header"
    class="relative pt-12 bg-secondary"
  >
    <cbutton
      :has-background="false"
      icon-only
      class="absolute right-4 top-8"
    >
      <cicon
        name="pause"
        size="medium"
      />
    </cbutton>

    <div class="relative ml-32 mr-48">
      <div class="w-56 h-56 absolute z-2 -top-4 -left-4 rounded-full border-quinary border bg-secondary">
        <div class="relative w-full h-full flex items-center justify-center">
          <cicon
            name="heart-full"
            type="fill"
            size="xxLarge"
            class="animate-pulse"
          />

          <cbadge
            :value="lives"
            class="absolute z-2 bottom-2 right-2"
          />
        </div>
      </div>

      <div class="flex items-center justify-between bg-tertiary border-t border-l border-r border-quinary rounded-tl-20 rounded-tr-20 h-40 pl-64 overflow-hidden">
        <span>
          {{ originalWord }}
        </span>
        <div class="flex items-center justify-center w-56 h-full text-s font-semibold bg-secondary bg-opacity-5 border-quinary border-l">
          {{ currentRound }}/{{ totalRounds }}
        </div>
      </div>
    </div>

    <div class="border-quinary border-t border-b py-8 text-center uppercase">
      <span
        v-for="(letter, index) in guessWord"
        :key="index"
        :class="setLetterClass(letter)"
        class="px-4"
      >
        {{ setLetterCharacter(letter) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Letter } from '@project/interfaces'
import { ref, computed, onMounted, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'UiGameTop',
  setup () {

    // Injects
    const store = useStore()

    // Refs
    const header = ref(null)

    // Computed
    const lives = computed(() => store.getters['game/matchLives'])
    const totalRounds = computed(() => store.getters['game/matchRoundsTotal'])
    const currentRound = computed(() => store.getters['game/matchRoundsCurrent'])
    const originalWord = computed(() => store.getters['game/roundWordOriginal'])
    const guessWord = computed(() => store.getters['game/roundWordGuess'])

    // Methods
    const setLetterClass = (letter: Letter): string => {
      return letter.guessed
        ? null
        : 'text-primary'
    }

    const setLetterCharacter = (letter: Letter): string => {
      return letter.guessed
        ? letter.letter
        : '?'
    }

    // Hooks
    onMounted (() => {
      store.dispatch('game/setUIElementHeight', {
        header: header.value.getBoundingClientRect().height
      })
    })

    return {
      header,
      lives,
      currentRound,
      totalRounds,
      originalWord,
      guessWord,
      setLetterClass,
      setLetterCharacter
    }
  }
})
</script>
