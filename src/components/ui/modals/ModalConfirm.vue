<script setup lang="ts">
interface Props {
  eventName: string
  eventCallbackParams: string
  heading: string
  byline?: string
  iconName?: IconName
  ctaText?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconName: 'info',
  ctaText: 'Confirm',
})

const emit = defineEmits<{
  (eventName: string, ...args: any[]): void
}>()
</script>

<template>
  <div class="mb-8">
    <h3>{{ heading }}</h3>

    <span
      v-if="byline"
      class="text-sm text-quaternary-light"
    >
      {{ byline }}
    </span>
  </div>

  <Button
    size="md"
    has-icon
    @click="emit(props.eventName, eventCallbackParams)"
  >
    <Icon
      :name="iconName"
      size="md"
      type="fill"
    />

    {{ ctaText }}
  </Button>
</template>
