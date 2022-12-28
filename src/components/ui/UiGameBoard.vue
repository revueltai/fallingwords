<template>
  <div class="ui-bg">
    <dash v-if="isUIReady" />
    <character v-if="isUIReady" />
    <tiles v-if="isUIReady" />

    <div class="ui-fade-zone" />

    <board />
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, nextTick } from 'vue'
import Character from '../partials/Character.vue'
import Board from '../partials/Board.vue'
import Tiles from '../partials/Tiles.vue'
import Dash from '../partials/Dash.vue'

export default defineComponent({
  name: 'UiGameBoard',
  components: {
    Board,
    Character,
    Tiles,
    Dash
  },
  setup () {
    // Refs
    const isUIReady = ref(false)

    // Hooks
    onMounted (() => {
      nextTick(() => {
        isUIReady.value = true
      })
    })

    return {
      isUIReady
    }
  }
})
</script>

<style scoped>
.ui-bg {
  @apply absolute left-0 top-0 bottom-0 w-full h-full bg-repeat;
  background-image: url('/images/ui/bg-game.svg');
  background-size: 100px;
}

.ui-fade-zone {
  @apply absolute bottom-0 w-full h-104 bg-gradient-to-b from-transparent to-secondary via-secondary;
}
</style>
