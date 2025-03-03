<script setup lang="ts">
import type { MbCustomAnimation } from 'movinblocks'
import { UI } from '@/configs/constants'
import Movinblocks from 'movinblocks'
import { onMounted } from 'vue'

onMounted(() => {
  new Movinblocks()
    .setTimeline(['logo', 'gameStart', 'tutorial'])
    .setAnimation([
      'revealInTop',
      UI.animationClasses.named.scaleIn as MbCustomAnimation,
      UI.animationClasses.named.scaleIn as MbCustomAnimation,
    ])
    .setOverlap(200)
    .setDuration([800, 600, 200])
    .prepare()
    .start()
})
</script>

<template>
  <section class="absolute flex items-center justify-center w-full h-full text-center u-bg-app">
    <div class="w-full h-full bg-gradient-to-b from-transparent to-secondary-light from-50% to-[200%]">
      <div class="flex items-center justify-center flex-col gap-20 h-full">
        <img
          id="logo"
          src="/images/ui/logo.png"
          alt="logo"
          class="w-80 mx-auto"
          width="260"
          height="177"
        >

        <div class="flex flex-col gap-6 text-center p-10">
          <div id="gameStart">
            <Button
              to="game"
              background-color="tertiary"
              border-color="tertiary-light"
              class="w-[200px]"
            >
              Get Started!
            </Button>
          </div>

          <div id="tutorial">
            <Button
              to="tutorial"
              size="md"
              class="w-auto self-center"
            >
              Tutorial
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
