<script setup lang="ts">
</script>

<template>
  <div class="mb-8">
    <p class="text-sm">
      Play more and collect gems to get this item.
    </p>
  </div>

  <Button
    background-color="tertiary"
    border-color="tertiary-light"
    to="game-lobby"
    size="md"
    has-icon
  >
    <Icon
      name="game"
      size="md"
      type="fill"
    />

    Play now
  </Button>
</template>
