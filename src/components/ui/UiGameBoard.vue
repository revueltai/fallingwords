<template>
  <div class="ui-bg">
    <template v-if="isUIReady">
      <dash :boardRef="board" />

      <character :board-ref="board" />

      <template v-for="tile in tiles">
        <tile
          v-if="tile"
          :tile="tile"
          :board-ref="board"
        />
      </template>
    </template>

    <div class="ui-fade-zone"/>

    <board ref="board" />
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import Character from '../partials/Character.vue'
import Board from '../partials/Board.vue'
import Tile from '../partials/Tile.vue'
import Dash from '../partials/Dash.vue'

const dummyWords = [
  {
    original: 'Speed',
    learn: 'Geschwindigkeit'
  },
  {
    original: 'Hello',
    learn: 'Hallo'
  }
]

const dummyLocales = {
  original: 'en',
  learn: 'de'
}

export default defineComponent({
  name: 'UiGameBoard',
  components: {
    Board,
    Character,
    Tile,
    Dash
  },
  setup () {
    // Injects
    const store = useStore()

    // Refs
    const isUIReady = ref(false)
    const board = ref(null)
    const character = ref(null)

    // Computed
    const tiles = computed(() => store.getters['game/roundBoardTiles'])

    // Methods
    const initMatch = () => {
      store.dispatch('game/initMatch', {
        words: dummyWords,
        locales: dummyLocales
      })
    }

    // Event Handlers

    // Hooks
    onMounted (() => {
      nextTick(() => {
        isUIReady.value = true
        initMatch()
      })
    })

    return {
      isUIReady,
      board,
      character,
      tiles
    }
  }
})
</script>

<style scoped>
.ui-bg {
  @apply absolute top-0 bottom-0 w-full h-full bg-repeat;
  background-image: url('/images/ui/bg-game.svg');
  background-size: 100px;
}

.ui-fade-zone {
  @apply absolute bottom-0 w-full h-104 bg-gradient-to-b from-transparent to-secondary via-secondary;
}
</style>
