<script setup lang="ts">
import { dummyLocales, dummyWords } from '@/assets/dummyData'

import GameBoard from '@/components/game/ui/GameBoard.vue'
import GameBottom from '@/components/game/ui/GameBottom.vue'
import GameOverlay from '@/components/game/ui/GameOverlay.vue'
import GamePowerupBar from '@/components/game/ui/GamePowerupBar.vue'
import GamePowerupGlow from '@/components/game/ui/GamePowerupGlow.vue'
import GameTop from '@/components/game/ui/GameTop.vue'
import { useGameStore } from '@/stores/game.store'
import Movinblocks from 'movinblocks'
import { onMounted } from 'vue'

const gameStore = useGameStore()

function setUIAnimation() {
  new Movinblocks()
    .setTimeline(['gameTop', 'gameBottom'])
    .setAnimation(['slideInTop', 'slideInBottom'])
    .setOverlap(200)
    .setDuration(800)
    .prepare()
    .start()
}

onMounted(() => {
  gameStore.prepareGame({ words: dummyWords, locales: dummyLocales })
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
