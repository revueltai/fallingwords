<script setup lang="ts">
import ProfileItem from './ProfileItem.vue'

interface Props {
  iconName: IconName
  amount: string | number
  text: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex justify-start border border-secondary-light p-3 gap-1 rounded-xl">
    <Icon
      :name="iconName"
      size="xl"
      type="fill"
    />

    <ProfileItem :text="text">
      {{ amount }}
    </ProfileItem>
  </div>
</template>
