<script setup lang="ts">
type FlagSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  countryCode: string
  size?: FlagSize
}

withDefaults(defineProps<Props>(), {
  size: 'md',
})

const sizes = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
}
</script>

<template>
  <img
    :src="`/images/flags/flag${countryCode?.toUpperCase()}.svg`"
    :width="sizes[size]"
    :height="sizes[size]"
  >
</template>
