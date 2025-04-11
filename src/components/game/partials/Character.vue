<script setup lang="ts">
import CharacterMessage from '@/components/game/partials/CharacterMessage.vue'
import { useGameBoardStore } from '@/stores/gameBoard.store'
import { useGameCharacterStore } from '@/stores/gameCharacter.store'
import { useGameRoundStore } from '@/stores/gameRound.store'
import { useSoundStore } from '@/stores/sounds.store'
import { isMobile } from '@/utils'
import { Bus } from '@/utils/EventBus'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const soundStore = useSoundStore()
const gameRoundStore = useGameRoundStore()
const gameBoardStore = useGameBoardStore()
const gameCharacterStore = useGameCharacterStore()

const moveDistance: number = 10
let previousX: number = 0
let posX: number = 0
let posY: number = 0

const characterRef = ref<RefElement>(null)
const characterAssetRef = ref<RefElement>(null)
const characterCollisionRef = ref<RefElement>(null)
const isLoaded = ref(false)

function isValidControlKey(key: string): boolean {
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

function getPositionXFromTouchDirection(direction: CharacterMobileControlDirection) {
  const { rect } = getCharacterData()

  setExpression('open')
  soundStore.playSoundEffect('characterMove')

  if (direction === 'left') {
    return rect.left - moveDistance
  } else {
    return rect.right + moveDistance
  }
}

function getPositionXFromKeys(event: KeyboardEvent) {
  const { rect } = getCharacterData()

  if (isValidControlKey(event.key)) {
    setExpression('open')
    soundStore.playSoundEffect('characterMove')
  }

  switch (event.key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      return rect.left - moveDistance

    case 'ArrowRight':
    case 'D':
    case 'd':
      return rect.right + moveDistance
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

function updateCharacterPosition(newPosX: number) {
  const boardRect = getBoardRect()
  const { el, rect } = getCharacterData()

  if (!boardRect || !gameBoardStore.boardEl || !(el && rect) || gameCharacterStore.isEating) {
    return null
  }

  const cX = newPosX || rect.left

  posX = clampPositionToBounds(
    cX - gameBoardStore.boardEl.getBoundingClientRect().left - rect.width / 2,
    boardRect.width,
    rect.width,
  )

  setCharacterPosition()
  addTilt()
}

function handleMoveOnMobileTouchStart(direction: CharacterMobileControlDirection) {
  if (!gameRoundStore.roundIsPlaying) {
    return
  }

  const newXPos = getPositionXFromTouchDirection(direction)
  updateCharacterPosition(newXPos)
}

function handleMoveOnKeyDown(event: CharacterEvent) {
  if (!gameRoundStore.roundIsPlaying) {
    return
  }

  if (event instanceof KeyboardEvent && isValidControlKey(event.key)) {
    const newXPos = getPositionXFromKeys(event) // ?? rect.left
    updateCharacterPosition(newXPos)
  }
}

function handleResize() {
  repositionCharacter()
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
      Bus.on('mobileControlStart', handleMoveOnMobileTouchStart)
      Bus.on('mobileControlEnd', handleEnd)
    } else {
      window.addEventListener('keyup', handleEnd, false)
      window.addEventListener('keydown', handleMoveOnKeyDown, false)
    }

    initCharacter()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)

  if (isMobile() && gameBoardStore.boardEl) {
    Bus.off('mobileControlStart', handleMoveOnMobileTouchStart)
    Bus.off('mobileControlEnd', handleEnd)
  } else {
    window.removeEventListener('keyup', handleEnd)
    window.removeEventListener('keydown', handleMoveOnKeyDown)
  }
})
</script>

<template>
  <div
    ref="characterRef"
    class="absolute w-20 h-20 transition-transform origin-center linear px-1 border bg-secondary-dark border-secondary-light rounded-full flex items-center justify-center xs:w-16 xs:h-16"
  >
    <div
      ref="characterCollisionRef"
      class="absolute z-30 h-2 w-2 bottom-5 bg-primary opacity-0"
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
