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

    <div 
      ref="characterAsset"
      :class="isLoaded ? 'visible' : ''"
      class="character__asset"
    >
      <img 
        :src="characterExpressionAsset"
        class="block anim-like"
      >

    </div>

    <character-message />
  </div>
</template>

<script lang="ts">
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { isMobile } from '../../utils/game.utils'
import characterMessage from './CharacterMessage.vue'
import {
  UICharacter,
  CharacterEvent,
  CharacterExpressions
} from '@project/interfaces'

export default defineComponent({
  name: 'Character',
  components: {
    characterMessage
  },
  setup () {
    let previousX: number = 0
    let posX: number = 0
    let posY: number = 0

    // Refs
    const store = useStore()
    const character = ref(null)
    const characterAsset = ref(null)
    const characterCollisionEl = ref(null)
    const isLoaded = ref(false)

    // Computed
    const isPlaying = computed(() => store.getters['game/matchIsPlaying'])
    const offset = computed(() => store.getters['gameCharacter/offset'])
    const characterExpression = computed(() => store.getters['gameCharacter/expression'])
    const characterExpressionAsset = computed(() => store.getters['gameCharacter/expressionAsset'])
    const boardEl = computed(() => store.getters['gameBoard/boardEl'])

    // Watchers
    watch(characterExpression, (newExpression: CharacterExpressions) => {
      setExpressionClasses(newExpression)
    })

    // Methods
    const isValidKeyboardKey = (key: string): boolean => {
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

    const removeTilt = () => {
      characterAsset.value.classList.remove('tilt__left', 'tilt__right')
    }

    const addTilt = (event: CharacterEvent) => {
      removeTilt()

      const deltaX = previousX - posX
      previousX = posX

      const direction = deltaX > 0
        ? 'right'
        : 'left'

      characterAsset.value.classList.add(`tilt__${direction}`)
    }

    const getBoardRect = (): DOMRect => {
      return boardEl.value.getBoundingClientRect()
    }

    const getCharacterData = (): UICharacter => {
      return {
        el: character.value,
        rect: character.value.getBoundingClientRect()
      }
    }

    const getPositionXFromTouch = (event: TouchEvent): number => {
      return event.touches[0].clientX
    }

    const getPositionXFromArrowKeys = (event: KeyboardEvent, character: UICharacter): number => {
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

    const setCharacterPosition = () => {
      const { el } = getCharacterData()
      el.style.transform = `translate(${posX}px, ${posY}px)`
    }

    const setExpressionClasses = (expression: CharacterExpressions) => {
      const el: HTMLElement = characterAsset.value
      const className: string = `anim-${expression}`
      el.classList.add(className)
      
      setTimeout(() => {
        el.classList.remove(className)
      }, 800)
    }
    
    const setExpression = (expression: CharacterExpressions) => {
      setExpressionClasses(expression)
      store.dispatch('gameCharacter/setExpression', expression)
    }

    const repositionCharacter = () => {
      const boardRect: DOMRect = getBoardRect()
      const { rect } = getCharacterData()

      posX = (boardRect.width / 2) - (rect.width / 2)
      posY = (boardRect.height * offset.value / 100) - (rect.height / 2)

      setCharacterPosition()
    }

    const updateCharacterPosition = (event: CharacterEvent) => {
      const boardRect: DOMRect = getBoardRect()
      const character: UICharacter = getCharacterData()
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
      } else if (posX > boardRect.width - character.rect.width) {
        posX = boardRect.width - character.rect.width
      }

      setCharacterPosition()
    }

    // Event Handlers
    const handleMove = (event: CharacterEvent) => {
      if (isPlaying.value) {
        updateCharacterPosition(event) 
        
        if (window.TouchEvent && event instanceof TouchEvent) {
          addTilt(event)
          return
        }
        
        if (event instanceof KeyboardEvent && isValidKeyboardKey(event.key)) {
          addTilt(event)
          return
        }
      }
    }

    const handleResize = () => {
      repositionCharacter()
    }

    const handleStart = (event: TouchEvent) => {
      if (isPlaying.value) {
        previousX = getPositionXFromTouch(event)

        if (window.TouchEvent && event instanceof TouchEvent) {
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
      store.dispatch('gameCharacter/setElement', characterCollisionEl.value)

      setTimeout(() => {
        isLoaded.value = true
      }, 500)
    }

    // Hooks
    onMounted (() => {
      nextTick(() => {
        window.addEventListener('resize', handleResize, false)

        if (isMobile()) {
          const board: HTMLElement = boardEl.value
          board.addEventListener('touchstart', handleStart, { passive: true })
          board.addEventListener('touchend', handleEnd, false)
          board.addEventListener('touchmove', handleMove, { passive: true })
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
        const board: HTMLElement = boardEl.value
        board.removeEventListener('touchstart', handleStart)
        board.removeEventListener('touchend', handleEnd)
        board.removeEventListener('touchmove', handleMove)
      } else {
        window.removeEventListener('keyup', handleEnd)
        window.removeEventListener('keydown', handleMove)
      }
    })

    return {
      character,
      characterAsset,
      characterCollisionEl,
      characterExpressionAsset,
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

.character {
  @apply absolute border-primary w-64 h-64;
}

.character__asset {
  @apply transform transition-all opacity-0 duration-200 ease-in-out;
}

.visible {
  @apply opacity-100;
}

.character__collision-area {
  @apply absolute z-30 w-24 h-8 -ml-12 left-2/4 bottom-3 opacity-0;
}

.tilt__left {
  @apply rotate-12;
}

.tilt__right {
  @apply -rotate-12;
}
</style>
