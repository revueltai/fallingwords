<script setup lang="ts">
import ItemIndicator from '@/components/ui/ItemIndicator.vue'

interface Props {
  itemToPurchase: ShopItem
}

defineProps<Props>()

const emit = defineEmits(['purchase'])
</script>

<template>
  <div class="mb-8 flex flex-col items-center">
    <p>
      {{ $t('youAreAboutToSpend') }}
    </p>

    <ItemIndicator
      :text="itemToPurchase.price"
      class="my-4"
    />

    <p>
      {{ $t('onThisItem') }}
    </p>
  </div>

  <Button
    background-color="tertiary"
    border-color="tertiary-light"
    size="md"
    @click="emit('purchase')"
  >
    {{ $t('yesIWantThis') }}
  </Button>
</template>
