<script setup lang="ts">
import { useGameStore } from '@/stores/game.store'
import { useGameUIStore } from '@/stores/gameUI.store'
import { computed, onMounted, ref } from 'vue'

const gameUIStore = useGameUIStore()
const gameStore = useGameStore()

const headerRef = ref<HTMLElement | null>(null)

const isRoundOver = false
// const isRoundOver = computed(() => gameStore.roundIsOver)

const lifes = computed(() => gameStore.matchLifes)
const totalRounds = computed(() => gameStore.matchRoundsTotal)
const currentRound = computed(() => gameStore.matchRoundsCurrent + 1)
const originalWord = computed(() => gameStore.roundWordOriginal)
const guessWord = computed(() => gameStore.roundWordGuess)

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
    gameUIStore.setOverlayFadeIn()
    gameStore.setGamePause()
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
    class="relative pt-3 bg-secondary"
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
      <div class="w-14 h-14 absolute -top-1 -left-1 rounded-full border-quinary border bg-secondary">
        <div class="relative w-full h-full flex items-center justify-center">
          <Icon
            :class="lifes < 2 ? 'anim-beat' : ''"
            name="heart-full"
            type="fill"
            size="2xl"
          />

          <Badge
            :value="lifes"
            class="absolute z-2 bottom-0.5 right-0.5"
          />
        </div>
      </div>

      <div class="flex items-center justify-between bg-tertiary border-t border-l border-r border-quinary rounded-tl-2xl rounded-tr-2xl h-10 pl-16 overflow-hidden">
        <span>
          {{ originalWord }}
        </span>

        <div class="flex items-center justify-center w-14 h-full text-s font-semibold bg-secondary bg-opacity-5 border-quinary border-l">
          {{ currentRound }}/{{ totalRounds }}
        </div>
      </div>
    </div>

    <div class="border-quinary border-t border-b py-2 text-center uppercase">
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
