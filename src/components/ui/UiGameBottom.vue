<template>
  <div
    ref="footer"
    class="ui-footer"
  >
    <div
      class="ui-footer__left"
        v-anim="'fade-in'"
        v-anim-delay="2400"
        v-anim-duration="1200"
    >
      <cbutton
        :has-background="false"
        icon-only
      >
        <cicon
          size="lg"
          type="fill"
          name="info"
        />
      </cbutton>
    </div>

    <div class="ui-footer__center">
      <ui-game-bottom-powerups />
    </div>

    <div class="ui-footer__right">
      <cbutton
        :has-background="false"
        icon-only
      >
        <cicon
          size="lg"
          name="skip"
        />
      </cbutton>
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
  @apply absolute flex justify-between w-full bottom-0;
}

.ui-footer__left,
.ui-footer__right,
.ui-footer__center {
  @apply bg-tertiary border-t border-quinary;
}

.ui-footer__left {
  @apply border-r rounded-tr-24;
}

.ui-footer__center {
  @apply border-l border-r rounded-tl-24 rounded-tr-24 px-16;
}

.ui-footer__right {
  @apply border-l rounded-tl-24;
}
</style>
