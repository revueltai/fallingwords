<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores/user.store'
import { onMounted } from 'vue'

const userStore = useUserStore()
</script>

<template>
  <section>
    login
  </section>
</template>
