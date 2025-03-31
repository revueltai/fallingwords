<script setup lang="ts">
import Streak from '@/components/ui/Streak.vue'
import { MouthHungry } from '@/configs/assets.config'

interface Props {
  isLobby: boolean
}

defineProps<Props>()

const emit = defineEmits([
  'showDashboard',
])
</script>

<template>
  <header
    id="header"
    class="relative flex flex-col items-center gap-6 pt-10 u-bg-app px-4"
  >
    <div class="flex flex-col items-center gap-3">
      <img
        id="character"
        :src="MouthHungry"
        width="84"
        height="84"
      >

      <h2 id="heading">
        Dot is feeling...
      </h2>

      <div
        id="status"
        class="rounded-full border-2 border-quaternary uppercase text-sm px-2 py-1 text-center"
      >
        Hungry
      </div>
    </div>

    <Streak
      v-show="!isLobby"
      id="streak"
    />

    <Button
      v-if="isLobby"
      background-color="senary"
      border-color="senary-light"
      icon-only
      :has-shadow="false"
      :class="isLobby ? 'anim-scale-in-timed' : 'anim-scale-out-timed'"
      class="absolute top-3 right-3"
      @click="emit('showDashboard')"
    >
      <Icon
        name="cornerDownLeft"
        size="sm"
        stroke-width="4"
      />
    </Button>
  </header>
</template>
