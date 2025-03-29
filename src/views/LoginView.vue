<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores/user.store'
import { onMounted } from 'vue'

const userAccountStore = useUserStore()
</script>

<template>
  <section>
    login
  </section>
</template>
