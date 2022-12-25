<template>
  <template 
    v-for="tile in tiles"
    :key="tile"
  >
    <tile
      v-if="tile"
      :tile="tile"
    />
  </template>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import Tile from './Tile.vue'

export default defineComponent({
  name: 'Tiles',  
  components: {
    Tile
  },
  props: {
    tiles: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    // Injects
    const store = useStore()

    // Computed
    const tiles = computed(() => store.getters['game/roundBoardTiles'])

    return {
      tiles
    }
  }
})
</script>