<script setup lang="ts">
interface Props {
  heading: string
  itemName: string
  amount: string | number
  iconName: IconName
  textColor: Color
}

defineProps<Props>()
</script>

<template>
  <div>
    <p class="mb-4 text-sm">
      {{ heading }}
    </p>

    <div class="relative p-4 rounded-2xl border border-secondary bg-secondary-dark anim-scale-in-timed">
      <p class="text-xs pb-2">
        {{ $t('dotGiftedYou') }}
      </p>

      <div class="flex w-full justify-center items-center gap-3">
        <Icon
          :name="iconName"
          size="xl"
          type="fill"
        />

        <p
          class="text-lg sm:text-2xl"
          :class="`text-${textColor}`"
        >
          <span>{{ amount }}</span> {{ itemName }}
        </p>
      </div>
    </div>
  </div>
</template>
