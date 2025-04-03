<script setup lang="ts">
interface Props {
  itemToPurchase: ShopItem
}

defineProps<Props>()

const emit = defineEmits(['purchase'])
</script>

<template>
  <div class="mb-8 flex flex-col items-center">
    <p class="text-sm">
      You’re about to spend
    </p>

    <div class="flex gap-1 items-center bg-secondary-dark rounded-full px-4 py-2 my-4 justify-center">
      <Icon
        name="gem"
        size="lg"
        type="fill"
      />

      <span class="text-lg">
        {{ itemToPurchase.price }}
      </span>
    </div>

    <p class="text-sm">
      on this item.
    </p>
  </div>

  <Button
    background-color="tertiary"
    border-color="tertiary-light"
    size="md"
    @click="emit('purchase')"
  >
    Yes, I want this!
  </Button>
</template>
