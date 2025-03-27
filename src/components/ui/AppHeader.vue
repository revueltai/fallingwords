<script setup lang="ts">
import AppHeaderItem from '@/components/ui/AppHeaderItem.vue'
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
        :count="234"
      />

      <AppHeaderItem
        icon-name="heart-full"
        :count="80"
      />
    </div>
  </header>
</template>
