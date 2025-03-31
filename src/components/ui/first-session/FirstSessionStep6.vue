<script setup lang="ts">
import { POWERUPS } from '@/configs/constants'
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
  <div class="flex flex-col gap-3 items-start px-8 py-10">
    <div
      v-for="(powerup, index) in POWERUPS"
      :id="`p${powerup.id}`"
      :key="index"
      class="flex gap-2 items-center justify-center"
    >
      <Icon
        :name="powerup.asset"
        size="3xl"
        stroke-size="2"
        type="fill"
      />

      <span class="text-md">
        {{ powerup.description }}
      </span>
    </div>
  </div>
</template>
