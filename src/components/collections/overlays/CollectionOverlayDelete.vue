<script setup lang="ts">
defineProps<{ uid: string }>()

const emit = defineEmits(['delete'])
</script>

<template>
  <p class="mb-8">
    Are you sure you want to delete this Collection?
  </p>

  <Button
    size="md"
    has-icon
    @click="emit('delete', uid)"
  >
    <Icon
      name="trashbin"
      size="md"
      type="fill"
    />

    Delete
  </Button>
</template>
