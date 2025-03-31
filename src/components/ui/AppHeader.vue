<script setup lang="ts">
import AppHeaderItem from '@/components/ui/AppHeaderItem.vue'
import { useUserStore } from '@/stores/user.store'

const userStore = useUserStore()
</script>

<template>
  <header class="w-full relative flex justify-between px-4 py-3">
    <AppHeaderItem
      icon-name="streak"
      :count="8"
    />

    <div class="flex gap-4">
      <AppHeaderItem
        icon-name="gem"
        :count="userStore.gems"
      />

      <AppHeaderItem
        icon-name="heart-full"
        :count="userStore.lives"
      />
    </div>
  </header>
</template>
