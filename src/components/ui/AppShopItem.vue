<script lang="ts" setup>
interface Props {
  uid: string
  asset: string
  amount: any
  value: string | number
}

defineProps<Props>()

const emit = defineEmits(['click'])
</script>

<template>
  <div
    class="flex flex-col items-center rounded-2xl gap-3 border border-b-4 border-secondary bg-secondary-dark p-4 transition-colors cursor-pointer hover:border-secondary-light"
    @click="emit('click', uid)"
  >
    <div class="relative">
      <img
        :src="`/images/shop/${asset}.svg`"
        width="70"
        height="80"
      >

      <span
        v-for="(el, index) in amount"
        :key="index"
        class="absolute right-0 bottom-0 bg-senary rounded-md px-1"
      >
        + {{ el }}
      </span>
    </div>

    <div class="flex gap-1 items-center">
      <Icon
        name="gem"
        size="md"
        type="fill"
      />

      <span class="text-lg mt-2">
        {{ value }}
      </span>
    </div>
  </div>
</template>
