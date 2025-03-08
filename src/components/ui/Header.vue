<script setup lang="ts">

</script>

<template>
  <header class="absolute z-10 top-0 w-full flex items-center justify-center px-4 bg-gradient-to-b from-secondary-dark to-transparent">
    <div class="flex items-center gap-2 justify-between rounded-b-3xl w-full pl-5 pr-2 py-2 bg-secondary border border-t-0 border-secondary-light">
      <div>
        Collections
      </div>

      <Button
        icon-only
        to="dashboard"
        :has-shadow="false"
        border-stroke-width="1"
        background-color="quaternary"
        border-color="quaternary-light"
        class="anim-scale-in-timed"
      >
        <Icon
          name="cross"
          size="sm"
          stroke-width="4"
        />
      </Button>
    </div>
  </header>
</template>
