<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { isLetterInWord } from '@/stores/utils.store'
import { makeNegative } from '@/utils'
import { useGameStore } from '@/stores/game.store'
import { useAppStore } from '@/stores/app.store'
import { useGameBoardStore } from '@/stores/gameBoard.store'
import { useGameCharacterStore } from '@/stores/gameCharacter.store'

const props = defineProps<{ tile: BoardLetter }>()

let posX: number = 0
let posY: number = 0
let raf: number = 0

const gameStore = useGameStore()
const gameCharacterStore = useGameCharacterStore()
const gameBoardStore = useGameBoardStore()
const appStore = useAppStore()

const tileRef = ref<HTMLElement | null>(null)
const tileWrapperRef = ref<HTMLElement | null>(null)
const fps = ref<number | null>(null)
const visible = ref(true)
let disableRAF = ref(false)

const characterEl = computed(() => gameCharacterStore.characterEl)
const boardEl = computed(() => gameBoardStore.boardEl)
const canvasEl = computed(() => appStore.canvasEl)
const speed = computed(() => gameStore.speed)
const powerups = computed(() => gameStore.powerups)
const activePowerup = computed(() => gameStore.roundActivePowerupType)
const roundWord = computed(() => gameStore.roundWordGuess)
const hasActivePowerup = computed(() => !!activePowerup.value)
const isPlaying = computed(() => gameStore.roundIsPlaying)
const isPowerupTile = computed(() => !!props.tile.powerup)

const cssClasses = computed(() => hasActivePowerup.value
  ? getClassnameForPowerupType()
  : getClassnameForTileType()
)

const displayLetter = computed(() => props.tile.letter)

const displayPowerup = computed(() => isPowerupTile.value
  ? props.tile.powerup?.asset
  : null
)

function isWordLetter() {
  return isPowerupTile.value
    ? false
    : isLetterInWord(props.tile.letter, roundWord.value)
}

function getClassnameForTileType () {
  return isPowerupTile.value
    ? 'type__powerup'
    : 'type__letter'
}

function getClassnameForPowerupType() {
  const { fire, ice, wind } = powerups.value
  const activePowerupType = activePowerup.value
  let cssClasses: string | string[] = ''

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
      cssClasses = [
        getClassnameForTileType(),
        'type__powerup-wind'
      ]
      break
  }

  return cssClasses
}

function setCoordinates() {
  if (boardEl.value && tileRef.value) {
    const boardRect: DOMRect = boardEl.value.getBoundingClientRect()
    const tileRect: DOMRect = tileRef.value.getBoundingClientRect()

    posX = Math.round(Math.random() * (boardRect.width - tileRect.width))
    posY = Math.round(makeNegative(Math.random() * boardRect.height))
  }
}

function setFPS() {
  const newFPS = Math.floor(Math.random() * (60 - 24) + 24)

  if (newFPS) {
    fps.value = newFPS
  }
}

function isTileCollidingWithCharacter() {
  if (tileRef.value && tileWrapperRef.value && characterEl.value) {
    const tileRect = tileRef.value.getBoundingClientRect()
    const characterElRect = characterEl.value.getBoundingClientRect()

    const p1: boolean = tileRect.left < characterElRect.left + characterElRect.width
    const p2: boolean = tileRect.left + tileRect.width > characterElRect.left
    const p3: boolean = tileRect.top < characterElRect.bottom + characterElRect.height
    const p4: boolean = tileRect.top + tileRect.height > characterElRect.bottom

    if (p1 && p2 && p3 && p4) {
      disableRAF.value = true
      tileWrapperRef.value.classList.add('scale-0')
      tileWrapperRef.value.addEventListener('transitionend', handleAnimationEnd)
    }
  }

  return disableRAF.value
}

function isTileOutOfBounds() {
  if (tileRef.value && canvasEl.value) {
    const tileRect = tileRef.value.getBoundingClientRect()
    const limit = canvasEl.value.getBoundingClientRect().height

    return tileRect.y > limit
  }

  return false
}

function isMoveableTile () {
  return visible.value && isPlaying.value
}

function move () {
  posY += speed.value

  if (tileRef.value) {
    tileRef.value.style.transform = `translate(${posX}px, ${posY}px)`
  }
}

function remove () {
  visible.value = false
  gameStore.deleteTile(props.tile)
  gameStore.createTile()
}

function removeTile (directRemoval: boolean = true) {
  if (directRemoval) {
    remove()
    return
  }

  tileRef.value?.addEventListener('transitionend', remove)
}

function animateNewFrame () {
  if (fps.value) {
    setTimeout(() => {
      raf = requestAnimationFrame(handleRAF)
    }, 1000 / fps.value)
  }
}

function handleRAF () {
  if (tileRef.value) {
    const tileCollidesWithCharacter = isTileCollidingWithCharacter()
    const tileOutOfBounds = isTileOutOfBounds()

    if (tileCollidesWithCharacter || tileOutOfBounds) {
      removeTile(tileOutOfBounds)
      cancelAnimationFrame(raf)
      return
    }

    if (isMoveableTile()) {
      move()
    }

    animateNewFrame()
  }
}

function handleAnimationEnd () {
  gameStore.checkTile(props.tile)
  removeTile()
}

function initialize () {
  nextTick(() => {
    setCoordinates()
    setFPS()
    animateNewFrame()
  })
}

watch(activePowerup, (type) => {
  if (tileWrapperRef.value) {
    const { wind } = powerups.value

    switch (type) {
      case wind.id:
        const tileWrapperEl = tileWrapperRef.value
        const duration = gameStore.matchPowerupsDuration

        tileWrapperEl.style.animationDuration = `${duration}ms`
        tileWrapperEl.addEventListener('animationend', handleAnimationEnd)
        break
    }
  }
})

onMounted (() => initialize())

onBeforeUnmount (() => {
  cancelAnimationFrame(raf)
  tileRef.value?.removeEventListener('transitionend', remove)
  tileWrapperRef.value?.addEventListener('animationend', handleAnimationEnd)
})
</script>

<template>
  <div
    v-if="visible"
    ref="tileRef"
    :class="cssClasses"
    class="absolute -top-3 left-0 w-12 h-12 origin-center tile"
  >
    <div
      ref="tileWrapperRef"
      class="tile__wrapper rounded-full w-12 h-12 border transform transition-transform duration-150"
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
  @apply border bg-secondary;
}

.type__letter .tile__wrapper {
  @apply border-info;
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
  @apply border-primary text-primary-lighter bg-secondary;
  background-image: url('/images/tile/powerup-ice__deco1.svg');
  background-position: center top;
}

/* FIRE Powerup */
.type__powerup-fire .tile__wrapper {
  @apply border-warning text-yellow-200 bg-secondary;
  box-shadow: inset 0 0 6px 0 var(--c-danger),
              0 0 6px 0 var(--c-warning);
}

.type__powerup-wind .tile__wrapper {
  animation-name: powerupWind;
  animation-timing-function: ease-out;
  animation-direction: forwards;
}
</style>
