<script setup lang="ts">
import GameBoard from '@/components/game/ui/GameBoard.vue'
import GameBottom from '@/components/game/ui/GameBottom.vue'
import GameModal from '@/components/game/ui/GameModal.vue'
import GamePowerupBar from '@/components/game/ui/GamePowerupBar.vue'
import GamePowerupGlow from '@/components/game/ui/GamePowerupGlow.vue'
import GameTop from '@/components/game/ui/GameTop.vue'
import { useGameStore } from '@/stores/game.store'
import { useGameRoundStore } from '@/stores/gameRound.store'
import { useSoundStore } from '@/stores/sounds.store'
import { isEmptyArray } from '@/utils'
import Movinblocks from 'movinblocks'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const soundStore = useSoundStore()
const gameStore = useGameStore()
const gameRoundStore = useGameRoundStore()

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
  if (isEmptyArray(gameStore.gameWordsList)) {
    router.push('/')
    return
  }

  soundStore.stopLoopSound()
  soundStore.playLoopSound('gameBg')
  gameRoundStore.prepareRound()

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
    <GameModal />
  </section>
</template>
