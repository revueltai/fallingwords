<script setup lang="ts">
import { dummyLocales, dummyWords } from '@/assets/dummyData'

import GameBoard from '@/components/game/GameBoard.vue'
import GameBottom from '@/components/game/GameBottom.vue'
import GameOverlay from '@/components/game/GameOverlay.vue'
import GamePowerupBar from '@/components/game/GamePowerupBar.vue'
import GamePowerupGlow from '@/components/game/GamePowerupGlow.vue'
import GameTop from '@/components/game/GameTop.vue'
import { useGameStore } from '@/stores/game.store'
import Movinblocks from 'movinblocks'
import { onMounted } from 'vue'
import 'movinblocks/styles'

const store = useGameStore()

function setUIAnimation() {
  new Movinblocks()
    .setTimeline(['gameTop', 'gameBottom'])
    .setAnimation([
      'slideInTop',
      'slideInBottom',
      // 'fadeIn',
    ])
    .setOverlap(200)
    .setDuration(800)
    .prepare()
    .start()
}

onMounted(() => {
  store.prepareMatch({
    words: dummyWords,
    locales: dummyLocales,
  })

  setUIAnimation()
})
</script>

<template>
  <section class="relative w-full h-full">
    <GameBoard />
    <GameTop />
    <GameBottom />
    <GamePowerupBar />
    <GamePowerupGlow />
    <GameOverlay />
  </section>
</template>
