<template>
  <div
    ref="header"
    class="ui-game-top"
  >
    <cbutton
      :has-background="false"
      icon-only
      class="ui-game-top__pause"
      :disabled="isRoundOver"
      @click="handlePause"
    >
      <cicon
        name="pause"
        size="md"
      />
    </cbutton>

    <div class="ui-game-top__lives">
      <div class="ui-game-top__lives-wrapper">
        <div class="relative w-full h-full flex items-center justify-center">
          <cicon
            :class="lifes < 2 ? 'anim-beat' : ''"
            name="heart-full"
            type="fill"
            size="2xl"
          />

          <cbadge
            :value="lifes"
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

    <div class="ui-game-top__guess-word">
      <span
        v-for="letter in guessWord"
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
    const isRoundOver = computed(() => store.getters['game/roundIsOver'])
    const lifes = computed(() => store.getters['game/matchLifes'])
    const totalRounds = computed(() => store.getters['game/matchRoundsTotal'])
    const currentRound = computed(() => store.getters['game/matchRoundsCurrent'] + 1)
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

    // Events
    const handlePause = () => {
      if (!isRoundOver.value) {
        store.dispatch('gameUI/setOverlayFadeIn')
        store.dispatch('game/setGamePause')
      }
    }

    // Hooks
    onMounted (() => {
      store.dispatch('gameUI/setElement', {
        header: header.value
      })
    })

    return {
      header,
      lifes,
      isRoundOver,
      currentRound,
      totalRounds,
      originalWord,
      guessWord,
      setLetterClass,
      setLetterCharacter,
      handlePause
    }
  }
})
</script>

<style scoped>
.ui-game-top {
  @apply relative pt-12 bg-secondary;
  animation: slide-fade-in-top .5s ease-in-out;
}

.ui-game-top__lives {
  @apply relative ml-32 mr-48;
}

.ui-game-top__lives-wrapper {
  @apply w-56 h-56 absolute -top-4 -left-4 rounded-full border-quinary border bg-secondary;
}

.ui-game-top__pause {
  @apply absolute right-4 top-8;
}
.ui-game-top__guess-word {
  @apply border-quinary border-t border-b py-8 text-center uppercase;
}
</style>