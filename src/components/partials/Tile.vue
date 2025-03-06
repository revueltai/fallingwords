<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import { useGameStore } from '@/stores/game.store'
import { useGameBoardStore } from '@/stores/gameBoard.store'
import { useGameCharacterStore } from '@/stores/gameCharacter.store'
import { useGameRoundStore } from '@/stores/gameRound.store'
import { isLetterInWord } from '@/stores/utils.store'
import { makeNegative } from '@/utils'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{ tile: BoardLetter }>()

let posX: number = 0
let posY: number = -100
let raf: number = 0
const tileSpeedMultiplier = {
  min: 0.7,
  max: 2,
}

const appStore = useAppStore()
const gameStore = useGameStore()
const gameRoundStore = useGameRoundStore()
const gameCharacterStore = useGameCharacterStore()
const gameBoardStore = useGameBoardStore()

const initialTileSpeed = ref<number | null>(null)
const tileRef = ref<ElementRef>(null)
const tileWrapperRef = ref<ElementRef>(null)
const isVisible = ref(false)
const animationIsPlaying = ref(true)

const hasActivePowerup = computed(() => !!gameRoundStore.roundActivePowerupType)

const isPowerupTile = computed(() => !!props.tile.powerup)

const cssClasses = computed(() => {
  if (gameRoundStore.roundIsLoading || gameRoundStore.roundIsReady) {
    return 'opacity-0'
  }

  const eatingClasses = gameCharacterStore.isEating
    ? 'opacity-50'
    : ''

  const output = hasActivePowerup.value
    ? getClassnameForPowerupType()
    : getClassnameForTileType()

  return `${output} ${eatingClasses}`
})

const displayLetter = computed(() => props.tile.letter)

const displayPowerup = computed(() => isPowerupTile.value
  ? props.tile.powerup?.asset
  : null,
)

const tileSpeed = computed(() => initialTileSpeed.value
  ? Number((initialTileSpeed.value * gameRoundStore.speed).toFixed(1))
  : 0,
)

function getClassnameForTileType() {
  return isPowerupTile.value
    ? 'type__powerup'
    : 'type__letter'
}

function getClassnameForPowerupType() {
  const { fire, ice, wind } = gameRoundStore.powerups
  const activePowerupType = gameRoundStore.roundActivePowerupType
  let cssClasses: string = ''

  switch (activePowerupType) {
    case ice.id:
      cssClasses = `type__powerup-${activePowerupType}`
      break

    case fire.id:
      cssClasses = isWordLetter()
        ? `type__powerup-${activePowerupType}`
        : getClassnameForTileType()
      break

    case wind.id:
      cssClasses = `${getClassnameForTileType()} type__powerup-wind`
      break
  }

  return cssClasses
}

function setCoordinates() {
  if (gameBoardStore.boardEl && tileRef.value) {
    const boardRect = gameBoardStore.boardEl.getBoundingClientRect()
    const tileRect = tileRef.value.getBoundingClientRect()

    posX = Math.round(Math.random() * (boardRect.width - tileRect.width))
    posY = Math.round(makeNegative(Math.random() * boardRect.height))
  }
}

function isTileCollidingWithCharacter() {
  if (
    tileRef.value
    && tileWrapperRef.value
    && gameCharacterStore.characterEl
    && !gameCharacterStore.isEating
  ) {
    const tileRect = tileRef.value.getBoundingClientRect()
    const characterElRect = gameCharacterStore.characterEl.getBoundingClientRect()

    const p1: boolean = tileRect.left < characterElRect.left + characterElRect.width
    const p2: boolean = tileRect.left + tileRect.width > characterElRect.left
    const p3: boolean = tileRect.top < characterElRect.bottom + characterElRect.height
    const p4: boolean = tileRect.top + tileRect.height > characterElRect.bottom

    return p1 && p2 && p3 && p4
  }

  return false
}

function isTileOutOfBounds() {
  if (!tileRef.value || !appStore.canvasEl) {
    return false
  }

  const tileRect = tileRef.value.getBoundingClientRect()
  const canvasRect = appStore.canvasEl.getBoundingClientRect()
  const relativeTileY = tileRect.top - canvasRect.top

  return relativeTileY > canvasRect.height
}

function isWordLetter() {
  if (isPowerupTile.value) {
    return false
  }

  return isLetterInWord(props.tile.letter, gameRoundStore.roundWordGuess)
}

function isMoveableTile() {
  return isVisible.value && gameRoundStore.roundIsPlaying
}

function animateNewFrame() {
  raf = requestAnimationFrame(updateTileAnimation)
}

function setInitialTileSpeed() {
  if (!initialTileSpeed.value) {
    initialTileSpeed.value = Number((Math.random() * (tileSpeedMultiplier.max - tileSpeedMultiplier.min) + tileSpeedMultiplier.min).toFixed(1))
  }
}

function moveTile() {
  posY += tileSpeed.value

  if (tileRef.value) {
    tileRef.value.style.transform = `translate(${posX}px, ${posY}px)`
  }
}

function repurposeTile() {
  const repurposedTileIndex = gameBoardStore.deleteTile(props.tile)

  if (repurposedTileIndex !== undefined) {
    gameBoardStore.createTile(repurposedTileIndex)
    posX = 0
    posY = 0
    isVisible.value = true

    moveTile()
    if (!gameRoundStore.roundIsPaused) {
      startAnimationLoop()
    }
  }
}

function stopAnimation() {
  animationIsPlaying.value = false
  cancelAnimationFrame(raf)
}

function resumeAnimation() {
  if (!gameRoundStore.roundIsPaused) {
    animationIsPlaying.value = true
    animateNewFrame()
  }
}

function updateTileAnimation() {
  if (gameRoundStore.roundIsPaused) {
    stopAnimation()
    return
  }

  if (tileRef.value) {
    const tileCollidesWithCharacter = isTileCollidingWithCharacter()
    const tileOutOfBounds = isTileOutOfBounds()

    if (tileCollidesWithCharacter || tileOutOfBounds) {
      if (tileCollidesWithCharacter) {
        gameBoardStore.checkTile(props.tile)
      }

      repurposeTile()
      return
    }

    if (isMoveableTile()) {
      moveTile()
    }

    animateNewFrame()
  }
}

function startAnimationLoop() {
  isVisible.value = true

  nextTick(() => {
    setCoordinates()
    setInitialTileSpeed()
    animateNewFrame()
  })
}

watch(
  () => gameRoundStore.roundIsPaused,
  (isPaused) => {
    if (isPaused) {
      stopAnimation()
    } else {
      resumeAnimation()
    }
  },
)

watch(
  () => gameRoundStore.roundActivePowerupType,
  (type) => {
    if (tileWrapperRef.value) {
      const { wind } = gameRoundStore.powerups

      switch (type) {
        case wind.id: {
          tileWrapperRef.value.style.animationDuration = `${gameStore.gamePowerupsDuration}ms`
          tileWrapperRef.value.addEventListener('animationend', () => {
            cancelAnimationFrame(raf)
            repurposeTile()
          })
          break
        }
      }
    }
  },
)

onMounted (() => startAnimationLoop())

onBeforeUnmount (() => cancelAnimationFrame(raf))
</script>

<template>
  <div
    ref="tileRef"
    :class="cssClasses"
    class="absolute -top-3 left-0 w-12 h-12 origin-center tile"
  >
    <div
      ref="tileWrapperRef"
      class="tile__wrapper rounded-full w-12 h-12 border transform transition-all duration-150"
    >
      <div class="relative h-full flex items-center justify-center">
        <div class="flex items-center justify-center h-full uppercase text-h5">
          <span v-if="displayLetter">
            {{ displayLetter }}
          </span>

          <Icon
            v-else
            :name="displayPowerup"
            type="fill"
            size="lg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes powerupWind {
  0% {
    opacity: 1;
    transform: translateX(0);
  }

  100% {
    filter: blur(4px);
    opacity: 0;
    transform: translateX(-25%);
  }
}

.tile {
  will-change: transform;
}

/* Default */
.type__letter .tile__wrapper,
.type__powerup .tile__wrapper {
  @apply border bg-secondary-dark;
}

.type__letter .tile__wrapper {
  @apply border-senary;
}

.type__powerup .tile__wrapper {
  @apply border-primary;
}

/* Powerups Shared */
.type__powerup-fire,
.type__powerup-ice,
.type__powerup-ice .tile__wrapper {
  @apply bg-no-repeat;
}

/* ICE Powerup */
.type__powerup-ice {
  height: 53px;
  background-image: url('/images/tile/powerup-ice__deco2.svg');
  background-position: center bottom;
}

.type__powerup-ice .tile__wrapper {
  @apply border-primary text-primary-light bg-secondary-dark;
  background-image: url('/images/tile/powerup-ice__deco1.svg');
  background-position: center top;
}

/* FIRE Powerup */
.type__powerup-fire .tile__wrapper {
  @apply border-quinary-light text-yellow-200 bg-secondary-dark;
  box-shadow: inset 0 0 6px 0 var(--color-white),
              0 0 6px 0 var(--color-quinary-light);
}

.type__powerup-wind .tile__wrapper {
  animation-name: powerupWind;
  animation-timing-function: ease-out;
  animation-direction: forwards;
}
</style>
