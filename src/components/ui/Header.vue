<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  heading: string[]
  returnPath: string
}

const props = defineProps<Props>()

const sanitizedReturnPath = computed(() => props.returnPath.startsWith('/')
  ? props.returnPath
  : `/${props.returnPath}`,
)
</script>

<template>
  <header class="absolute z-10 top-0 w-full flex items-center justify-center px-4 bg-gradient-to-b from-secondary-dark to-transparent">
    <div class="flex items-center gap-2 justify-between rounded-b-3xl w-full pl-5 pr-2 py-2 bg-secondary border border-t-0 border-secondary-light">
      <Breadcrumbs :breadcrumbs="heading" />

      <Button
        icon-only
        :to="sanitizedReturnPath"
        :has-shadow="false"
        border-stroke-width="1"
        background-color="senary"
        border-color="senary-light"
        class="anim-scale-in-timed"
      >
        <Icon
          name="cornerDownLeft"
          size="sm"
          stroke-width="4"
        />
      </Button>
    </div>
  </header>
</template>
