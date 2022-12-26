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
import { useStore } from 'vuex'
import Character from '../partials/Character.vue'
import Board from '../partials/Board.vue'
import Tiles from '../partials/Tiles.vue'
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
    Tiles,
    Dash
  },
  setup () {
    // Injects
    const store = useStore()

    // Refs
    const isUIReady = ref(false)

    // Methods
    const initialize = () => {
      nextTick(() => {
        store.dispatch('game/initMatch', {
          words: dummyWords,
          locales: dummyLocales
        })

        isUIReady.value = true
      })
    }

    // Event Handlers

    // Hooks
    onMounted (() => {
      initialize()
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
