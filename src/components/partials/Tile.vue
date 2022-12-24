<template>
  <div
    v-if="visible"
    ref="tile"
    :class="cssClasses"
    class="tile"
  >
    <div
      ref="tileWrapper"
      class="tile__wrapper transform transition-transform duration-150"
    >
      <div class="tile__wrapper-item">
        <div class="tile__content">
          <span v-if="displayLetter">
            {{ displayLetter }}
          </span>

          <cicon
            v-else
            :name="displayPowerup"
            type="fill"
            size="large"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, defineComponent, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { isLetterInWord } from '../../store/game.utils'

export default defineComponent({
  name: 'Tile',
  props: {
    tile: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    let posX: number = 0
    let posY: number = 0
    let raf: number = 0

    // Injects
    const store = useStore()

    // Refs
    const tile = ref(null)
    const tileWrapper = ref(null)
    const visible = ref(true)
    const letterInWord = ref(false)
    let disableRAF = ref(false)
    const fps = ref(null)

    // Computed
    const characterEl = computed(() => store.getters['gameCharacter/characterEl'])
    const boardEl = computed(() => store.getters['gameBoard/boardEl'])
    const canvasEl = computed(() => store.getters['app/canvasEl'])
    const speed = computed(() => store.getters['game/speed'])
    const activePowerup = computed(() => store.getters['game/roundActivePowerupType'])
    const hasActivePowerup = computed(() => !!activePowerup.value)
    const isPowerupTile = computed(() => !!props.tile.powerup)

    const cssClasses = computed(() => {
      return hasActivePowerup.value
        ? getClassnameForPowerupType()
        : getClassnameForTileType()
    })

    const displayLetter = computed(() => {
      return props.tile.letter
    })

    const displayPowerup = computed(() => {
      if (isPowerupTile.value) {
        return props.tile.powerup.name
      }

      return null
    })

    // Methods
    const isWordLetter = () => {
      if (isPowerupTile.value) {
        return false
      }

      const word = store.getters['game/roundWordGuess']
      return isLetterInWord(props.tile.letter, word)
    }

    const getClassnameForTileType = () => {
      return isPowerupTile.value
        ? 'type__powerup'
        : 'type__letter'
    }

    const getClassnameForPowerupType = () => {
      const ap = activePowerup.value

      switch (ap) {
        case 'ice':
          return `type__powerup-${ap}`

        case 'fire':
          return letterInWord.value
            ? `type__powerup-${ap}`
            : getClassnameForTileType()

        case 'wind':
          return [
            getClassnameForTileType(),
            'type__powerup-wind'
          ]
      }
    }

    const setPosition = () => {
      if (tile.value) {
        tile.value.style.transform = `translate(${posX}px, ${posY}px)`        
      }
    }

    const setCoordinates = () => {
      const boardRect: DOMRect = boardEl.value.getBoundingClientRect()
      const tileRect: DOMRect = tile.value.getBoundingClientRect()
      console.log(boardRect.width);
      
      posX = Math.round(Math.random() * (boardRect.width - tileRect.width))
      
      if (posX > 550) {
        console.log(posX);        
      }
      
      posY = Math.round(Math.random() * boardRect.height * -1)
    }

    const isCollidingWithCharacter = () => {
      const tileEl: HTMLElement = tile.value
      const tileWrapperEl: HTMLElement = tileWrapper.value
      const tileRect: DOMRect = tileEl.getBoundingClientRect()
      const characterElRect: DOMRect = characterEl.value.getBoundingClientRect()

      const p1: boolean = tileRect.left < characterElRect.left + characterElRect.width
      const p2: boolean = tileRect.left + tileRect.width > characterElRect.left
      const p3: boolean = tileRect.top < characterElRect.bottom + characterElRect.height
      const p4: boolean = tileRect.top + tileRect.height > characterElRect.bottom

      if (p1 && p2 && p3 && p4) {
        disableRAF.value = true
        store.dispatch('game/checkTile', props.tile)

        tileWrapperEl.classList.add('scale-0')
      }

      return disableRAF.value
    }

    const isOutOfBounds = () => {
      const tileRect: DOMRect = tile.value.getBoundingClientRect()
      const limit: number = canvasEl.value.getBoundingClientRect().height

      if (tileRect.y > limit) {
        disableRAF.value = true
      }

      return disableRAF.value
    }

    const doAnimation = () => {
      const isPlaying = store.getters['game/matchIsPlaying']
      const isVisible = visible.value

      return isVisible && isPlaying
    }

    const move = () => {
      posY += speed.value
      setPosition()
    }

    const remove = () => {
      visible.value = false
      store.dispatch('game/deleteTile', props.tile)
      store.dispatch('game/getTile')
    }

    const removeTile = (directRemoval: boolean = true) => {
      if (directRemoval) {
        remove()
        return
      }

      tile.value.addEventListener('transitionend', remove)
    }

    const animateNewFrame = () => {
      setTimeout(() => {
        raf = requestAnimationFrame(handleRAF)
      }, 1000 / fps.value)
    }

    // Watchers
    watch(activePowerup, (type) => {
      switch (type) {
        case 'wind':
          const tileWrapperEl: HTMLElement = tileWrapper.value
          const duration = store.getters['game/matchPowerupsDuration']

          tileWrapperEl.style.animationDuration = `${duration}ms`
          tileWrapperEl.addEventListener('animationend', handleAnimationEnd)
          break
      }
    })

    // Event Handlers
    const handleRAF = () => {
      if (doAnimation()) {
        let tileOutOfBounds = null

        move()

        const tileCollidesWithCharacter = isCollidingWithCharacter()

        if (!tileCollidesWithCharacter) {
          tileOutOfBounds = isOutOfBounds()
        }

        if (tileCollidesWithCharacter || tileOutOfBounds) {
          removeTile(tileOutOfBounds)
          cancelAnimationFrame(raf)
        } else {
          animateNewFrame()
        }
      }
    }

    const handleAnimationEnd = () => {
      removeTile()
    }

    const initialize = () => {
      nextTick(() => {
        setCoordinates()
        letterInWord.value = isWordLetter()      
        fps.value = Math.floor(Math.random() * (60 - 24) + 24)
        raf = requestAnimationFrame(handleRAF)
      })
    }

    // Hooks
    onMounted (() => {      
      initialize()
    })

    onBeforeUnmount (() => {
      cancelAnimationFrame(raf)
      tile.value.removeEventListener('transitionend', remove)
      tileWrapper.value.addEventListener('animationend', handleAnimationEnd)
    })

    return {
      fps,
      visible,
      tile,
      tileWrapper,
      cssClasses,
      displayLetter,
      displayPowerup,
      disableRAF,
      handleRAF
    }
  }
})
</script>

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
  @apply absolute top-24 left-80 w-48 h-48 origin-center;
  will-change: transform;
}

.tile__wrapper {
  @apply rounded-full w-48 h-48 border;
}
.tile__wrapper-item {
  @apply relative h-full flex items-center justify-center;
}

.tile__content {
  @apply flex items-center justify-center h-full uppercase text-h5;
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
  @apply border-primary animate-pulse;
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
