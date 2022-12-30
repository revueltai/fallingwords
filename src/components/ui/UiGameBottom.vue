<template>
  <div
    ref="footer"
    class="ui-footer"
  >
    <div class="ui-footer__content">
      <ui-game-bottom-powerups />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import { useStore } from 'vuex'
import UiGameBottomPowerups from './UiGameBottomPowerups.vue'

export default defineComponent({
  name: 'UiGameBottom',
  components: {
    UiGameBottomPowerups
  },
  setup () {
    // Injects
    const store = useStore()

    // Refs
    const footer = ref(null)

    // Hooks
    onMounted(() => {
      store.dispatch('gameUI/setElementHeight', {
        footer: footer.value.getBoundingClientRect().height
      })
    })

    return {
      footer      
    }
  }
})
</script>

<style scoped>
.ui-footer {
  @apply absolute flex justify-center w-full bottom-0;
}

.ui-footer__content {
  @apply bg-tertiary border-t border-quinary border-l border-r rounded-tl-24 rounded-tr-24 px-16;
}
</style>
