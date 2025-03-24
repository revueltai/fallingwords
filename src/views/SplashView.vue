<script setup lang="ts">
import type { MbCustomAnimation } from 'movinblocks'
import { UI } from '@/configs/constants'
import Movinblocks from 'movinblocks'
import { onMounted } from 'vue'

onMounted(async () => {
  new Movinblocks()
    .setTimeline(['logo', 'gameStart', 'tutorial'])
    .setAnimation(UI.animationClasses.named.scaleIn as MbCustomAnimation)
    .setOverlap(200)
    .setDuration([1100, 600, 200])
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
          src="/images/shared/logo.svg"
          alt="logo"
          class="w-80 mx-auto"
          width="260"
          height="177"
        >

        <div class="flex flex-col gap-6 text-center p-10">
          <div id="gameStart">
            <Button
              to="dashboard"
              background-color="tertiary"
              border-color="tertiary-light"
              class="w-60"
              size="xl"
            >
              Get Started!
            </Button>
          </div>

          <div id="tutorial">
            <Button
              to="tutorial"
              size="sm"
              class="w-24 self-center"
            >
              Credits
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
