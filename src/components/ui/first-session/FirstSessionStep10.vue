<script setup lang="ts">
import { USER_ACCOUNT_DEFAULTS } from '@/configs/constants'
</script>

<template>
  <p class="mb-4">
    Here are some gems to fuel your journey!
  </p>

  <div class="relative p-4 rounded-2xl border border-secondary bg-secondary-dark anim-scale-in-timed">
    <p class="text-xs pb-2">
      DOT gifted you
    </p>

    <div class="flex w-full justify-center items-center gap-3">
      <Icon
        name="gem"
        size="xl"
      />

      <p class="text-2xl text-primary-light">
        <span class="">{{ USER_ACCOUNT_DEFAULTS.gems }}</span> Gems
      </p>
    </div>
  </div>
</template>
