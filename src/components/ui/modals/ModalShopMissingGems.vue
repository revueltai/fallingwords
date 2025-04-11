<script setup lang="ts">
interface Props {
  itemToPurchase?: any
  purchase?: any
}

defineProps<Props>()
</script>

<template>
  <div class="mb-8">
    <p class="text-sm">
      {{ $t('playMoreCollectGems') }}
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

    {{ $t('playNow') }}
  </Button>
</template>
