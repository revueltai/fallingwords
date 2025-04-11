<script setup lang="ts">
const emit = defineEmits(['click'])
</script>

<template>
  <div class="flex flex-col gap-3 justify-center mt-8 border-t border-secondary-light pt-8">
    <p class="text-sm text-center">
      {{ $t('wantEvenMoreLives') }}
    </p>

    <Button
      :has-shadow="false"
      has-icon
      background-color="secondary"
      border-color="secondary-light"
      size="xs"
      to="shop"
      class="w-40 mx-auto"
      @click="emit('click')"
    >
      <Icon
        name="shop"
        type="fill"
        size="sm"
      />
      {{ $t('checkoutShop') }}
    </Button>
  </div>
</template>
