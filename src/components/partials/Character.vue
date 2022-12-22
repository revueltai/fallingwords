<template>
  <div
    ref="character"
    :class="!isMobile() ? 'transition-transform origin-center ease-in-out' : ''"
    class="character"
  >
    <img
      ref="characterImage"
      :src="characterExpression"
      class="transform transition-transform duration-500 ease-in-out"
    >
  </div>
</template>

<script lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount, defineComponent } from 'vue'
import { useStore } from 'vuex'

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

    // Computed
    const isPlaying = computed(() => store.getters['game/matchIsPlaying'])
    const offset = computed(() => store.getters['game/offset'])
    const characterExpression = computed(() => store.getters['game/expression'])

    // Methods
    const isMobile = () => {
      return /Mobi/.test(navigator.userAgent)
    }

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
          return character.rect.left - distance

        case 'ArrowRight':
          return character.rect.right + distance
      }
    }

    const setCharacterPosition = () => {
      const { el } = getCharacterData()
      el.style.transform = `translate(${posX}px, ${posY}px)`
    }

    const setExpression = (newState: string) => {
      store.dispatch('game/setExpression', newState)
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
        setExpression('open')
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
      }
    }

    const handleEnd = () => {
      if (isPlaying.value) {
        setExpression('idle')
        removeTilt()
      }
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

        handleResize()
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
        window.addEventListener('keyup', handleEnd)
        window.addEventListener('keydown', handleMove)
      }
    })

    return {
      character,
      characterImage,
      characterExpression,
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
  @apply fixed border-primary w-64 h-64;
}
.tilt__left {
  @apply rotate-12;
}

.tilt__right {
  @apply -rotate-12;
}
</style>
