<script setup lang="ts">
import { POWERUPS } from '@/configs/constants'
import { isMobile } from '@/utils'
import Movinblocks from 'movinblocks'
import { onMounted } from 'vue'

onMounted(() => {
  const ids = Object.values(POWERUPS).map(powerup => `p${powerup.id}`)

  new Movinblocks()
    .setTimeline(ids)
    .setOverlap(200)
    .setDuration(800)
    .prepare()
    .start()
})
</script>

<template>
  <div class="flex flex-col gap-2 items-start px-8 py-2 sm:py-10">
    <div
      v-for="(powerup, index) in POWERUPS"
      :id="`p${powerup.id}`"
      :key="index"
      class="flex gap-2 items-center justify-center"
    >
      <Icon
        :name="powerup.asset"
        :size="isMobile() ? 'xl' : '3xl'"
        stroke-size="2"
        type="fill"
      />

      <span class="text-start text-sm">
        {{ $t(powerup.description!) }}
      </span>
    </div>
  </div>
</template>
