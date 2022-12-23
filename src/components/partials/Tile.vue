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
    boardRef: {
      type: Object,
      default: null
    },
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
    const speed = computed(() => store.getters['game/speed'])
    const characterEl = computed(() => store.getters['gameCharacter/collisionEl'])
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
      tile.value.style.transform = `translate(${posX}px, ${posY}px)`
    }

    const isCollidingWithCharacter = () => {
      const tileEl = tile.value
      const tileWrapperEl = tileWrapper.value
      const tileRect = tileEl.getBoundingClientRect()
      const characterElRect = characterEl.value.getBoundingClientRect()

      const p1 = tileRect.left < characterElRect.left + characterElRect.width
      const p2 = tileRect.left + tileRect.width > characterElRect.left
      const p3 = tileRect.top < characterElRect.bottom + characterElRect.height
      const p4 = tileRect.top + tileRect.height > characterElRect.bottom

      if (p1 && p2 && p3 && p4) {
        disableRAF.value = true
        store.dispatch('game/checkTile', props.tile)

        tileWrapperEl.classList.add('scale-0')
      }

      return disableRAF.value
    }

    const isOutOfBounds = () => {
      const tileRect = tile.value.getBoundingClientRect()
      const limitY = document.documentElement.getBoundingClientRect().height

      if (tileRect.y > limitY) {
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

    const updatePosition = () => {
      const boardRect = document.documentElement.getBoundingClientRect()
      const tileRect = tile.value.getBoundingClientRect()

      posY = Math.round(Math.random() * 1000 * -1)
      posX = Math.round(Math.random() * (boardRect.width - tileRect.width))

      setPosition()
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
          const duration = store.getters['game/matchPowerupsDuration']
          const tileWrapperRef = tileWrapper.value

          tileWrapperRef.style.animationDuration = `${duration}ms`
          tileWrapperRef.addEventListener('animationend', handleAnimationEnd)
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

    // Hooks
    onMounted (() => {
      nextTick(() => {
        fps.value = Math.floor(Math.random() * (60 - 24) + 24)
        letterInWord.value = isWordLetter()
        updatePosition()
        raf = requestAnimationFrame(handleRAF)
      })
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
  @apply absolute top-24 left-80 w-48 ;
}

.tile__wrapper {
  @apply rounded-full w-48 h-48 border;
}
.tile__wrapper-item {
  @apply relative w-full h-full;
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
