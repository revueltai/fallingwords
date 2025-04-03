<script lang="ts" setup>
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

function getIconName(key: string) {
  return key === 'lives'
    ? 'heart-full'
    : `powerup-${key}`
}
</script>

<template>
  <div
    class="flex items-center rounded-2xl gap-4 border border-b-4 border-secondary-light bg-secondary pt-6 pb-5 px-4 transition-colors cursor-pointer hover:border-senary-light"
    @click="emit('click', uid)"
  >
    <div class="mx-2 text-center min-w-[84px]">
      <img
        :src="`/images/shop/${asset}.svg`"
        width="84"
        height="80"
        class="block w-[84px] h-20 mx-auto"
      >

      <div class="flex gap-1 items-center bg-secondary-dark rounded-full px-4 py-2 justify-center mt-3">
        <Icon
          name="gem"
          size="lg"
          type="fill"
        />

        <span class="text-lg">
          {{ value }}
        </span>
      </div>
    </div>

    <div class="">
      <p class="text-md sm:text-xl">
        {{ heading }}
      </p>

      <p class="text-primary text-xs sm:text-sm mt-1">
        {{ description }}
      </p>

      <div class="mt-3  flex items-center gap-2">
        <span
          v-for="(el, key) in amount"
          :key="key"
          class="flex items-center"
        >
          <Icon
            :name="getIconName(key as unknown as string)"
            size="xl"
            color="primary-light"
            type="fill"
          />

          <span>{{ el }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
