<script setup lang="ts">
import { computed } from 'vue'
import Tile from './Tile.vue'
import { useGameStore } from '@/stores/game.store'

withDefaults(defineProps(), {
  tiles: () => []
})

const store = useGameStore()

const tiles = computed(() => store.roundBoardTiles)
</script>

<template>
  <template
    v-for="(tile, index) in tiles"
    :key="index"
  >
    <Tile
      v-if="tile"
      :tile="tile"
    />
  </template>
</template>
