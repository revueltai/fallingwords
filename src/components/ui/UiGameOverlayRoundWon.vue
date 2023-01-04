<template>
  <ui-game-overlay-content 
    heading="Round Complete!"
  > 
    <div class="stars">
      <div class="stars__wrapper">
        <cicon 
          v-for="(star, index) in roundStars"
          :key="index"
          :name="star.name"
          size="2xl"
          class="star"
        />
      </div>
    </div>

    <div class="deco">
      <img :src="expression">
    </div>

    <div>
      <span class="time">{{ roundTimeLabel }}</span>
      <span class="time__label">TIME</span>
    </div>

    <template #footerLeft>
      <cbutton
        icon-only
        @click="handleGameCancelation"
      >
        <cicon
          name="home"
          size="lg"
        />
      </cbutton>
    </template>
    
    <template #footerCenter>
      <cbutton
        @click="handleGameIncreaseRound"
      >
        {{ ctaButton }}
      </cbutton>
    </template>
  </ui-game-overlay-content>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { UI } from '@/configs/constants'
import UiGameOverlayContent from './UiGameOverlayContent.vue'

export default defineComponent({
  name: 'UiGameOverlayRoundWon',
  components: {
    UiGameOverlayContent
  },
  setup() {
    // Injects
    const store = useStore()

    // Refs
    const ctaButton = ref('Continue')

    // Computed
    const overlayState = computed(() => store.getters['gameUI/overlayState'])
    const roundTime = computed(() => store.getters['game/roundTotalTime'])
    const roundTimeLabel = computed(() => {
      const time = roundTime.value

      if (time.minutes < 10) {
        time.minutes = '0' + time.minutes
      } 

      if (time.seconds < 10) {
        time.seconds = '0' + time.seconds
      } 
      
      return `${time.minutes}:${time.seconds}`
    })
    const roundPercentage = computed(() => {
      const roundWordGuess = store.getters['game/roundWordGuess']
      const secondsMultiplier = 4
      const rank = roundWordGuess.length * secondsMultiplier
      const totalTime = getRoundTimeInSeconds()
      return (rank / totalTime) * 100
    })
    const roundStars = computed(() => {
      const output = []
      output.push({ name: 'starFull' })

      if (roundPercentage.value > 50) {
        output.push({ name: 'starFull' })
      } else {
        output.push({ name: 'starEmpty' })
      }

      if (roundPercentage.value > 80) {
        output.push({ name: 'starFull' })
      } else {
        output.push({ name: 'starEmpty' })
      }    

      return output
    })
    const expression = computed(() => {
      const baseUrl = '/images/character/'
      
      if (roundPercentage.value > 80) {
        return baseUrl + 'MouthLikeHeart.svg'
      }
      
      if (roundPercentage.value > 50) {
        return baseUrl + 'MouthLike.svg'
      }
      
      return baseUrl + 'MouthIdle.svg'
    })

    // Watch
    watch(overlayState, (newState) => {
      if (newState === UI.overlayStates.hidden) {
        store.dispatch('game/increaseRound')
        store.dispatch('game/prepareRound')
      }
    })

    // Methods
    const getRoundTimeInSeconds = () => {
      const { seconds, minutes } = roundTime.value
      return seconds + (minutes * 60)
    }

    const hideOverlay = () => {
      store.dispatch('gameUI/setOverlayFadeOut')
    }
    
    const showOverlay = () => {
      store.dispatch('gameUI/setOverlayFadeIn')
    }

    // Events
    const handleGameCancelation = () => {
      store.dispatch('game/setGameReset')
      hideOverlay()
    }
    
    const handleGameIncreaseRound = () => {
      hideOverlay()
    }

    // Hooks
    onMounted(() => {
      showOverlay()
    })

    return {
      ctaButton,
      expression,
      roundTimeLabel,
      roundStars,
      handleGameCancelation,
      handleGameIncreaseRound
    }
  }
})
</script>

<style scoped>
.deco {
  @apply flex items-center justify-center bg-center bg-no-repeat mb-8;
  background-image: url('/images/ui/sunray.svg');
  background-size: 140px;
  height: 140px;
}

.time {
  @apply rounded-full bg-quinary text-center text-xl py-8 px-16 block mx-auto mb-8;
  width: 100px;
}

.time__label {
  @apply text-s mt-8;
}

.stars {
  @apply absolute top-0 left-0 w-full;
  transform: translateY(-50%);  
}

.stars__wrapper {
  @apply inline-flex gap-8;
}

.star:nth-child(2) {
  @apply origin-bottom;
  transform: scale(1.2);
}
</style>