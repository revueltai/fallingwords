<template>
  <div
    ref="character"
    :class="!isMobile() ? 'transition-transform origin-center linear' : ''"
    class="character"
  >
    <div
      ref="characterCollisionEl"
      class="character__collision-area"
    />

    <img
      ref="characterImage"
      :src="characterExpression"
      :class="isLoaded ? 'opacity-100' : ''"
      class="transform transition-all opacity-0 duration-200 ease-in-out"
    >
  </div>
</template>

<script lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { isMobile } from '../../utils/game.utils'

interface Character {
  el: HTMLElement;
  rect: DOMRect;
}

type CharacterEvent = TouchEvent | KeyboardEvent

export default defineComponent({
  name: 'Character',
  props: {
    boardRef: {
      type: Object,
      default: null
    },
  },
  setup (props) {
    let previousX: number = 0
    let posX: number = 0
    let posY: number = 0

    // Refs
    const store = useStore()
    const character = ref(null)
    const characterImage = ref(null)
    const characterCollisionEl = ref(null)
    const isLoaded = ref(false)

    // Computed
    const isPlaying = computed(() => store.getters['game/matchIsPlaying'])
    const offset = computed(() => store.getters['gameCharacter/offset'])
    const characterExpression = computed(() => store.getters['gameCharacter/expression'])

    // Methods
    const removeTilt = () => {
      characterImage.value.classList.remove('tilt__left', 'tilt__right')
    }

    const addTilt = () => {
      const deltaX = previousX - posX
      previousX = posX

      const direction = deltaX > 0
        ? 'right'
        : 'left'

      characterImage.value.classList.add(`tilt__${direction}`)
    }

    const getBoardData = (): DOMRect => {
      return props.boardRef.board.getBoundingClientRect()
    }

    const getCharacterData = (): Character => {
      return {
        el: character.value,
        rect: character.value.getBoundingClientRect()
      }
    }

    const getPositionXFromTouch = (event: TouchEvent): number => {
      return event.touches[0].clientX
    }

    const getPositionXFromArrowKeys = (event: KeyboardEvent, character: Character): number => {
      const distance: number = 1

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'a':
        case 'A':
        case 'd':
        case 'D':
          setExpression('open')
          break
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

    const setCharacterPosition = () => {
      const { el } = getCharacterData()
      el.style.transform = `translate(${posX}px, ${posY}px)`
    }

    const setExpression = (newState: string) => {
      store.dispatch('gameCharacter/setExpression', newState)
    }

    const repositionCharacter = () => {
      const boardRect = getBoardData()
      const { rect } = getCharacterData()

      posX = (boardRect.width / 2) - (rect.width / 2)
      posY = (boardRect.height * offset.value / 100) - (rect.height / 2)

      setCharacterPosition()
    }

    const updateCharacterPosition = (event: CharacterEvent) => {
      let cX: number
      const boardRect = getBoardData()
      const character: Character = getCharacterData()

      if (event instanceof TouchEvent) {
        cX = getPositionXFromTouch(event)
      }

      if (event instanceof KeyboardEvent) {
        cX = getPositionXFromArrowKeys(event, character)
      }

      posX = cX - character.rect.width / 2

      // Boundaries Collision
      if (posX < 0) {
        posX = 0
      } else if (posX > boardRect.width - character.rect.width) {
        posX = boardRect.width - character.rect.width
      }

      setCharacterPosition()
    }

    // Event Handlers
    const handleMove = (event: CharacterEvent) => {
      if (isPlaying.value) {
        updateCharacterPosition(event)
        removeTilt()
        addTilt()
      }
    }

    const handleResize = () => {
      repositionCharacter()
    }

    const handleStart = (event: TouchEvent) => {
      if (isPlaying.value) {
        previousX = getPositionXFromTouch(event)

        if (event instanceof TouchEvent) {
          setExpression('open')
        }
      }
    }

    const handleEnd = () => {
      if (isPlaying.value) {
        setExpression('idle')
        removeTilt()
      }
    }

    const initCharacter = () => {
      repositionCharacter()
      store.dispatch('gameCharacter/setCollisionElement', characterCollisionEl.value)
      setTimeout(() => {
        isLoaded.value = true
      }, 500)
    }

    // Hooks
    onMounted (() => {
      nextTick(() => {
        window.addEventListener('resize', handleResize, false)

        if (isMobile()) {
          const boardEl = props.boardRef.board
          boardEl.addEventListener('touchstart', handleStart, { passive: true })
          boardEl.addEventListener('touchend', handleEnd, false)
          boardEl.addEventListener('touchmove', handleMove, { passive: true })
        } else {
          window.addEventListener('keyup', handleEnd, false)
          window.addEventListener('keydown', handleMove, false)
        }

        initCharacter()
      })
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)

      if (isMobile()) {
        const boardEl = props.boardRef.board
        boardEl.removeEventListener('touchstart', handleStart)
        boardEl.removeEventListener('touchend', handleEnd)
        boardEl.removeEventListener('touchmove', handleMove)
      } else {
        window.removeEventListener('keyup', handleEnd)
        window.removeEventListener('keydown', handleMove)
      }
    })

    return {
      character,
      characterImage,
      characterCollisionEl,
      characterExpression,
      isLoaded,
      isMobile,
      handleResize,
      handleMove,
      handleStart,
      handleEnd
    }
  }
})
</script>

<style scoped>
.character {
  @apply absolute border-primary w-64 h-64;
}

.character__collision-area {
  @apply absolute w-32 h-24 left-1/4 bottom-2 opacity-50;
}
.tilt__left {
  @apply rotate-12;
}

.tilt__right {
  @apply -rotate-12;
}
</style>
