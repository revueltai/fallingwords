<script setup lang="ts">
interface Props {
  breadcrumbs: string[]
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-2 text-white font-semibold">
    <span
      v-for="(part, index) in breadcrumbs"
      :key="index"
      class="flex items-center gap-2"
    >
      <span
        class="truncate"
        :class="index === breadcrumbs.length - 1 && 'text-grey'"
      >
        {{ part }}
      </span>

      <Icon
        v-if="index < breadcrumbs.length - 1"
        name="chevronRight"
        color="senary-light"
      />
    </span>
  </div>
</template>
