<script lang="ts" setup>
import ItemIndicator from '@/components/ui/ItemIndicator.vue'

interface Props {
  uid: string
  asset: string
  heading: string
  description: string
  amount: any
  value: string | number
}

defineProps<Props>()

const emit = defineEmits(['click'])

function getIconName(key: string): IconName {
  return key === 'lives'
    ? 'heart-full'
    : `powerup-${key}` as IconName
}
</script>

<template>
  <div
    class="flex items-start rounded-2xl gap-6 border border-b-4 border-secondary-light bg-secondary pt-6 pb-5 px-4 transition-colors cursor-pointer hover:border-senary-light"
    @click="emit('click', uid)"
  >
    <div class="ml-2 text-center min-w-[84px]">
      <img
        :src="`/images/shop/${asset}.svg`"
        width="84"
        height="80"
        class="block w-[84px] h-20 mx-auto"
      >

      <ItemIndicator
        :text="value"
        class="mt-3"
      />
    </div>

    <div>
      <p class="text-md sm:text-xl">
        {{ $t(heading) }}
      </p>

      <p class="text-primary text-xs sm:text-sm mt-1">
        {{ $t(description) }}
      </p>

      <div class="mt-3 flex items-center gap-2">
        <ItemIndicator
          v-for="(el, key) in amount"
          :key="key"
          :text="el"
          :icon-name="getIconName(key as unknown as IconName)"
          icon-color="primary"
          border-color="transparent"
          background-color="transparent"
          padding="none"
        />
      </div>
    </div>
  </div>
</template>
