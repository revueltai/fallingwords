<template>
  <div class="relative">
    <ui-game-board />
    <ui-game-top />
    <ui-game-bottom />
    <ui-game-powerup-bar />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UiGameTop from '../components/ui/UiGameTop.vue'
import UiGameBottom from '../components/ui/UiGameBottom.vue'
import UiGameBoard from '../components/ui/UiGameBoard.vue'
import UiGamePowerupBar from '../components/ui/UiGamePowerupBar.vue'

export default defineComponent({
  name: 'Game',
  components: {
    UiGameTop,
    UiGameBottom,
    UiGameBoard,
    UiGamePowerupBar
  }
})
</script>
