<template>
  <div
    ref="character"
    :class="!isMobile() ? 'transition-all ease-in-out' : ''"
    class="fixed border-primary rounded-full w-64 h-64"
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

    const addTilt = (characterX: number) => {
      const deltaX = previousX - characterX
      previousX = characterX

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
      const distance: number = 24

      switch (event.key) {
        case 'ArrowLeft':
          return character.rect.left - distance

        case 'ArrowRight':
          return character.rect.right + distance
      }
    }

    const getCharacterXPosition = (event: CharacterEvent, character: Character): number => {
      let cX: number

      if (event instanceof TouchEvent) {
        cX = getPositionXFromTouch(event)
      }

      if (event instanceof KeyboardEvent) {
        cX = getPositionXFromArrowKeys(event, character)
      }

      return cX - character.rect.width / 2
    }

    const setExpression = (newState: string) => {
      store.dispatch('game/setExpression', newState)
    }

    const updateCharacterXPosition = (characterX: number, character: Character) => {
      const boardRect = getBoardData()

      // Boundaries
      if (characterX < 0) {
        characterX = 0
      } else if (characterX > boardRect.width - character.rect.width) {
        characterX = boardRect.width - character.rect.width
      }

      character.el.style.left = `${characterX}px`
    }

    const repositionCharacter = () => {
      const boardRect = getBoardData()
      const character = getCharacterData()

      const posX = (boardRect.width / 2) - (character.rect.width / 2)
      const posY = (boardRect.height * offset.value / 100) - (character.rect.height / 2)

      character.el.style.top = `${posY}px`
      character.el.style.left = `${posX}px`
    }

    // Event Handlers
    const handleMove = (event: CharacterEvent) => {
      if (isPlaying.value) {
        const character: Character = getCharacterData()
        let characterX: number = getCharacterXPosition(event, character)

        if (characterX) {
          updateCharacterXPosition(characterX, character)
          removeTilt()
          addTilt(characterX)
          setExpression('open')
        }
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
.tilt__left {
  @apply rotate-12;
}

.tilt__right {
  @apply -rotate-12;
}
</style>
