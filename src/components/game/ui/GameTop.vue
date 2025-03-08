<script setup lang="ts">
import { useGameStore } from '@/stores/game.store'
import { useGameRoundStore } from '@/stores/gameRound.store'
import { useGameUIStore } from '@/stores/gameUI.store'
import { isMobile } from '@/utils'
import { computed, onMounted, ref } from 'vue'

const gameUIStore = useGameUIStore()
const gameStore = useGameStore()
const gameRoundStore = useGameRoundStore()

const headerRef = ref<ElementRef>(null)

const isRoundOver = false
// const isRoundOver = computed(() => gameStore.roundIsOver)

const currentRound = computed(() => gameStore.gameCurrentRound + 1)

function setLetterClass(letter: Letter): string {
  return letter.guessed
    ? ''
    : 'text-primary'
}

function setLetterCharacter(letter: Letter): string {
  return letter.guessed
    ? letter.letter
    : '?'
}

function handlePause() {
  // if (!isRoundOver.value) {
  if (!isRoundOver) {
    gameUIStore.fadeInOverlay()
    gameRoundStore.pauseRound()
  }
}

onMounted (() => {
  gameUIStore.setElement({
    header: headerRef.value!,
  })
})
</script>

<template>
  <div
    id="gameTop"
    ref="headerRef"
    class="relative pt-3 bg-secondary-dark"
  >
    <Button
      :has-background="false"
      icon-only
      class="absolute right-1 top-2"
      :disabled="isRoundOver"
      @click="handlePause"
    >
      <Icon
        name="pause"
        size="md"
      />
    </Button>

    <div class="relative ml-8 mr-12">
      <div class="w-14 h-14 absolute -top-1 -left-1 rounded-full border-secondary-light border bg-secondary-dark">
        <div class="relative w-full h-full flex items-center justify-center">
          <Icon
            :class="gameStore.gameLives < 2 ? 'anim-beat' : ''"
            :size="isMobile() ? 'xl' : '2xl'"
            name="heart-full"
            type="fill"
          />

          <Badge
            :value="gameStore.gameLives"
            class="absolute z-2 bottom-0.5 right-0.5"
          />
        </div>
      </div>

      <div class="flex items-center justify-between bg-secondary border-t border-l border-r border-secondary-light rounded-tl-2xl rounded-tr-2xl h-10 pl-14 overflow-hidden">
        <span class="flex justify-center gap-2">
          <Flag :country-code="gameRoundStore.roundWordLocales?.original" />

          {{ gameRoundStore.roundWordOriginal }}
        </span>

        <div class="flex items-center justify-center w-14 h-full text-sm font-semibold bg-secondary-dark bg-opacity-5 border-secondary-light border-l xs:text-sm">
          {{ currentRound }}/{{ gameStore.gameTotalRounds }}
        </div>
      </div>
    </div>

    <div class="border-secondary-light border-t border-b py-2 text-center uppercase flex items-center justify-center gap-4">
      <Flag :country-code="gameRoundStore.roundWordLocales?.learn" />

      <div>
        <span
          v-for="(letter, index) in gameRoundStore.roundWordGuess"
          :key="index"
          :class="setLetterClass(letter)"
          class="px-1"
        >
          {{ setLetterCharacter(letter) }}
        </span>
      </div>
    </div>
  </div>
</template>
