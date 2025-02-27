<script setup lang="ts">
import CharacterMessage from '@/components/partials/CharacterMessage.vue'
import { useGameStore } from '@/stores/game.store'
import { useGameBoardStore } from '@/stores/gameBoard.store'
import { useGameCharacterStore } from '@/stores/gameCharacter.store'
import { isMobile } from '@/utils'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const gameStore = useGameStore()
const gameBoardStore = useGameBoardStore()
const gameCharacterStore = useGameCharacterStore()

let previousX: number = 0
let posX: number = 0
let posY: number = 0

const characterRef = ref<HTMLElement | null>(null)
const characterAssetRef = ref<HTMLElement | null>(null)
const characterCollisionRef = ref<HTMLElement | null>(null)
const isLoaded = ref(false)

const isPlaying = computed(() => gameStore.roundIsPlaying)
const offset = computed(() => gameCharacterStore.offset)
const characterExpression = computed(() => gameCharacterStore.expression)
const characterExpressionAsset = computed(() => gameCharacterStore.expressionAsset)
const boardEl = computed(() => gameBoardStore.boardEl)

function isValidKeyboardKey(key: string): boolean {
  switch (key) {
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'a':
    case 'A':
    case 'd':
    case 'D':
      return true
  }

  return false
}

function removeTilt() {
  characterAssetRef.value?.classList.remove('tilt__left', 'tilt__right')
}

function addTilt() {
  removeTilt()

  const deltaX = previousX - posX
  previousX = posX

  const direction = deltaX > 0
    ? 'right'
    : 'left'

  characterAssetRef.value?.classList.add(`tilt__${direction}`)
}

function getBoardRect() {
  return boardEl.value?.getBoundingClientRect()
}

function getCharacterData() {
  return {
    el: characterRef.value,
    rect: characterRef.value?.getBoundingClientRect(),
  }
}

function getPositionXFromTouch(event: TouchEvent) {
  return event.touches[0].clientX
}

function getPositionXFromArrowKeys(event: KeyboardEvent, character: Character) {
  const distance: number = 1

  if (isValidKeyboardKey(event.key)) {
    setExpression('open')
  }

  switch (event.key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      return character.rect.left - distance

    case 'ArrowRight':
    case 'D':
    case 'd':
      return character.rect.right + distance
  }
}

function setCharacterPosition() {
  const { el } = getCharacterData()
  if (el) {
    el.style.transform = `translate(${posX}px, ${posY}px)`
  }
}

function setExpressionClasses(expression: CharacterExpressionType) {
  if (characterAssetRef.value) {
    const className: string = `anim-${expression}`
    characterAssetRef.value.classList.add(className)

    setTimeout(() => {
      characterAssetRef.value.classList.remove(className)
    }, 800)
  }
}

function setExpression(expression: CharacterExpressionType) {
  setExpressionClasses(expression)
  gameCharacterStore.setExpression(expression)
}

function repositionCharacter() {
  const boardRect: DOMRect = getBoardRect()
  const { rect } = getCharacterData()

  posX = (boardRect.width / 2) - (rect.width / 2)
  posY = (boardRect.height * offset.value / 100) - (rect.height / 2)

  setCharacterPosition()
}

function updateCharacterPosition(event: CharacterEvent) {
  const boardRect: DOMRect = getBoardRect()
  const character = getCharacterData()
  let cX: number

  if (window.TouchEvent && event instanceof TouchEvent) {
    cX = getPositionXFromTouch(event)
  }

  if (event instanceof KeyboardEvent) {
    cX = getPositionXFromArrowKeys(event, character)
  }

  posX = cX - character.rect.width / 2

  // Boundaries Collision
  if (posX < 0) {
    posX = 0
  }
  else if (posX > boardRect.width - character.rect.width) {
    posX = boardRect.width - character.rect.width
  }

  setCharacterPosition()
}

function handleMove(event: CharacterEvent) {
  if (isPlaying.value) {
    updateCharacterPosition(event)

    if (window.TouchEvent && event instanceof TouchEvent) {
      addTilt(event)
      return
    }

    if (event instanceof KeyboardEvent && isValidKeyboardKey(event.key)) {
      addTilt(event)
    }
  }
}

function handleResize() {
  repositionCharacter()
}

function handleStart(event: TouchEvent) {
  if (isPlaying.value) {
    previousX = getPositionXFromTouch(event)

    if (window.TouchEvent && event instanceof TouchEvent) {
      setExpression('open')
    }
  }
}

function handleEnd() {
  if (isPlaying.value) {
    setExpression('idle')
    removeTilt()
  }
}

function initCharacter() {
  repositionCharacter()
  gameCharacterStore.setElement(characterCollisionRef.value)

  setTimeout(() => {
    isLoaded.value = true
  }, 500)
}

watch(characterExpression, (newExpression: CharacterExpressionType) => setExpressionClasses(newExpression))

onMounted (() => {
  nextTick(() => {
    window.addEventListener('resize', handleResize, false)

    if (isMobile() && boardEl.value) {
      boardEl.value.addEventListener('touchstart', handleStart, { passive: true })
      boardEl.value.addEventListener('touchend', handleEnd, false)
      boardEl.value.addEventListener('touchmove', handleMove, { passive: true })
    }
    else {
      window.addEventListener('keyup', handleEnd, false)
      window.addEventListener('keydown', handleMove, false)
    }

    initCharacter()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)

  if (isMobile() && boardEl.value) {
    boardEl.value.removeEventListener('touchstart', handleStart)
    boardEl.value.removeEventListener('touchend', handleEnd)
    boardEl.value.removeEventListener('touchmove', handleMove)
  }
  else {
    window.removeEventListener('keyup', handleEnd)
    window.removeEventListener('keydown', handleMove)
  }
})
</script>

<template>
  <div
    ref="characterRef"
    :class="!isMobile() ? 'transition-transform origin-center linear' : ''"
    class="absolute border-primary w-16 h-16"
  >
    <div
      ref="characterCollisionRef"
      class="absolute z-30 w-6 h-2 -ml-3 left-2/4 bottom-4 opacity-0"
    />

    <div
      id="gameCharacter"
      ref="characterAssetRef"
      :class="isLoaded ? 'opacity-100' : ''"
      class="transform transition-all opacity-0 duration-200 ease-in-out"
    >
      <img
        :src="characterExpressionAsset"
        class="block anim-like"
      >
    </div>

    <CharacterMessage />
  </div>
</template>

<style scoped>
@keyframes like {
  from,
  to {
    transform: translate3d(0, 0, 0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translate3d(0, -4px, 0);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translate3d(0, 4px, 0);
  }
}

@keyframes dislike {
  0%,
  50% {
    transform: translateX(0);
  }

  6.5% {
    transform: translateX(-6px) rotateY(-9deg);
  }

  18.5% {
    transform: translateX(5px) rotateY(7deg);
  }

  31.5% {
    transform: translateX(-3px) rotateY(-5deg);
  }

  43.5% {
    transform: translateX(2px) rotateY(3deg);
  }
}

.anim-like,
.anim-love {
  animation: like .5s ease-in-out;
}

.anim-dislike {
  animation: dislike .5s ease-in-out;
}

.tilt__left {
  @apply rotate-12;
}

.tilt__right {
  @apply -rotate-12;
}
</style>
