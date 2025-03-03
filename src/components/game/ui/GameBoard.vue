<script setup lang="ts">
import Board from '@/components/partials/Board.vue'
import Character from '@/components/partials/Character.vue'
import Dash from '@/components/partials/Dash.vue'
import Tiles from '@/components/partials/Tiles.vue'
import { nextTick, onMounted, ref } from 'vue'

const isUIReady = ref(false)

onMounted (() => nextTick(() => {
  isUIReady.value = true
}))
</script>

<template>
  <div class="absolute left-0 top-0 bottom-0 w-full h-full bg-repeat overflow-hidden u-bg-app">
    <Dash v-if="isUIReady" />
    <Character v-if="isUIReady" />
    <Tiles v-if="isUIReady" />

    <div class="absolute bottom-0 w-full h-28 bg-gradient-to-b from-transparent to-secondary-dark via-secondary-dark" />

    <Board />
  </div>
</template>
