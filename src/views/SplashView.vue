<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function loadAppResources() {
  // TODO: add resources to load
  router.push({ name: 'Dashboard' })
}

onMounted(async () => loadAppResources())
</script>

<template>
  <section class="absolute flex items-center justify-center w-full h-full text-center u-bg-app">
    <div class="w-full h-full bg-gradient-to-b from-transparent to-secondary-light from-50% to-[200%]">
      <div class="flex items-center justify-center flex-col gap-20 h-full">
        <img
          id="logo"
          src="/images/shared/logo.svg"
          alt="logo"
          class="w-80 mx-auto anim-scale-in-timed"
          width="260"
          height="177"
        >

        <p class="text-sm text-white">
          {{ $t('loading') }}...
        </p>
      </div>
    </div>
  </section>
</template>
