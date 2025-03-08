<script setup lang="ts">
import CharacterMessage from '@/components/game/partials/CharacterMessage.vue'
import { useGameBoardStore } from '@/stores/gameBoard.store'
import { useGameCharacterStore } from '@/stores/gameCharacter.store'
import { useGameRoundStore } from '@/stores/gameRound.store'
import { isMobile } from '@/utils'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const gameRoundStore = useGameRoundStore()
const gameBoardStore = useGameBoardStore()
const gameCharacterStore = useGameCharacterStore()

let previousX: number = 0
let posX: number = 0
let posY: number = 0

const characterRef = ref<ElementRef>(null)
const characterAssetRef = ref<ElementRef>(null)
const characterCollisionRef = ref<ElementRef>(null)
const isLoaded = ref(false)

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
  return gameBoardStore.boardEl?.getBoundingClientRect()
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
  const distance: number = 10

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
  if (
    characterAssetRef.value
    && ['like', 'dislike'].includes(expression)
  ) {
    const className = `anim-${expression}`
    characterAssetRef.value.classList.add(className)

    setTimeout(() => {
      if (characterAssetRef.value) {
        characterAssetRef.value.classList.remove(className)
      }
    }, 500)
  }
}

function setExpression(expressionType: CharacterExpressionType) {
  setExpressionClasses(expressionType)
  gameCharacterStore.setExpression(expressionType)
}

function repositionCharacter() {
  const boardRect = getBoardRect()
  const { rect } = getCharacterData()

  if (!boardRect || !rect) {
    return
  }

  posX = Math.round((boardRect.width / 2) - (rect.width / 2))
  posY = Math.round((boardRect.height * gameCharacterStore.offset / 100) - (rect.height / 2))

  setCharacterPosition()
}

function clampPositionToBounds(
  positionX: number,
  boardWidth: number,
  characterWidth: number,
): number {
  return Math.max(0, Math.min(positionX, boardWidth - characterWidth))
}

function updateCharacterPosition(event: CharacterEvent) {
  const boardRect = getBoardRect()
  const { el, rect } = getCharacterData()

  if (
    !boardRect || !gameBoardStore.boardEl || !(el && rect)
    || gameCharacterStore.isEating
  ) {
    return
  }

  let cX: number = rect.left

  if (window.TouchEvent && event instanceof TouchEvent) {
    cX = getPositionXFromTouch(event)
  } else if (event instanceof KeyboardEvent) {
    cX = getPositionXFromArrowKeys(event, { el, rect }) ?? rect.left
  }

  posX = clampPositionToBounds(
    cX - gameBoardStore.boardEl.getBoundingClientRect().left - rect.width / 2,
    boardRect.width,
    rect.width,
  )

  setCharacterPosition()
}

function handleMove(event: CharacterEvent) {
  if (!gameRoundStore.roundIsPlaying) {
    return
  }

  if ((window.TouchEvent && event instanceof TouchEvent)
    || (event instanceof KeyboardEvent && isValidKeyboardKey(event.key))) {
    updateCharacterPosition(event)
    addTilt()
  }
}

function handleResize() {
  repositionCharacter()
}

function handleStart(event: TouchEvent) {
  if (gameRoundStore.roundIsPlaying) {
    previousX = getPositionXFromTouch(event)

    if (window.TouchEvent && event instanceof TouchEvent) {
      setExpression('open')
    }
  }
}

function handleEnd() {
  if (gameRoundStore.roundIsPlaying) {
    setExpression('idle')
    removeTilt()
  }
}

function initCharacter() {
  repositionCharacter()
  gameCharacterStore.setElement(characterCollisionRef.value)
  isLoaded.value = true
}

watch(
  () => [
    gameRoundStore.roundIsWon,
    gameRoundStore.roundIsLost,
  ],
  ([roundIsWon, roundIsLost]) => {
    if (roundIsWon || roundIsLost) {
      repositionCharacter()
    }
  },
  { immediate: true },
)

watch(
  () => gameCharacterStore.expression,
  (newExpression: CharacterExpressionType) => setExpressionClasses(newExpression),
)

onMounted (() => {
  nextTick(() => {
    window.addEventListener('resize', handleResize, false)

    if (isMobile() && gameBoardStore.boardEl) {
      gameBoardStore.boardEl.addEventListener('touchstart', handleStart, { passive: true })
      gameBoardStore.boardEl.addEventListener('touchend', handleEnd, false)
      gameBoardStore.boardEl.addEventListener('touchmove', handleMove, { passive: true })
    } else {
      window.addEventListener('keyup', handleEnd, false)
      window.addEventListener('keydown', handleMove, false)
    }

    initCharacter()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)

  if (isMobile() && gameBoardStore.boardEl) {
    gameBoardStore.boardEl.removeEventListener('touchstart', handleStart)
    gameBoardStore.boardEl.removeEventListener('touchend', handleEnd)
    gameBoardStore.boardEl.removeEventListener('touchmove', handleMove)
  } else {
    window.removeEventListener('keyup', handleEnd)
    window.removeEventListener('keydown', handleMove)
  }
})
</script>

<template>
  <div
    ref="characterRef"
    :class="!isMobile() ? 'transition-transform origin-center linear' : ''"
    class="absolute w-20 h-20 px-1 border bg-secondary-dark border-secondary-light rounded-full flex items-center justify-center xs:w-16 xs:h-16"
  >
    <div
      ref="characterCollisionRef"
      class="absolute z-30 w-full h-3 bottom-5 bg-primary opacity-0"
    />

    <div
      id="gameCharacter"
      ref="characterAssetRef"
      :class="isLoaded ? 'opacity-100' : ''"
      class="transform transition-all opacity-0 duration-200 ease-in-out"
    >
      <img
        :src="gameCharacterStore.expressionAsset"
        class="block w-full h-full anim-like"
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
