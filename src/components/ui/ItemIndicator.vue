<script setup lang="ts">
interface Props {
  iconName?: IconName
  iconType?: IconType
  iconColor?: Color
  text?: string | number
  borderColor?: Color
  backgroundColor?: Color
  padding?: string | 'none'
}

withDefaults(defineProps<Props>(), {
  iconName: 'gem',
  iconType: 'fill',
  iconColor: 'white',
  text: '',
  borderColor: 'secondary-light',
  backgroundColor: 'secondary-dark',
  padding: 'px-4 py-2',
})
</script>

<template>
  <div
    :class="`bg-${backgroundColor} border-${borderColor} ${padding !== 'none' ? padding : ''}`"
    class="flex gap-1 items-center border rounded-full justify-center"
  >
    <Icon
      :name="iconName"
      :color="iconColor"
      :type="iconType"
      size="lg"
    />

    <span class="text-lg">
      {{ text }}
    </span>
  </div>
</template>
