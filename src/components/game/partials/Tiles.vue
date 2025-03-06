<script setup lang="ts">
import { useGameBoardStore } from '@/stores/gameBoard.store'
import { computed } from 'vue'
import Tile from './Tile.vue'

const gameBoardStore = useGameBoardStore()

const tiles = computed(() => gameBoardStore.roundBoardTiles)
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
