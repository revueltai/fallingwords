<template>
  <div
    ref="characterMessageEl"
    class="character-message"
  >
    {{ message }}
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'CharacterMessage',
  setup () {
    
    // Injects
    const store = useStore()

    // Refs
    const showClass = 'show'
    const characterMessageEl = ref(null)

    // Computed
    const message = computed(() => store.getters['gameCharacter/message'])
    
    // Watchers
    watch(message, (newMessage) => {
      if (newMessage) {
        const el = characterMessageEl.value
        el.classList.add(showClass)
        el.addEventListener('animationend', handleAnimationEnd)
      }
    })

    // Event Handlers
    const handleAnimationEnd = (event: AnimationEvent) => {
      event.stopPropagation()
      store.dispatch('gameCharacter/setMessage', '')
      characterMessageEl.value.classList.remove(showClass)
    }

    return {
      characterMessageEl,
      message
    }
  }
})
</script>

<style scoped>
@keyframes slideInMessage {
  0% { opacity: 0;
  }

  70% { 
    opacity: 1;
  }
  
  100% { 
    transform: translateY(-32px);
    opacity: 0;
  }
}

.character-message {
  @apply absolute font-bold text-center right-0 top-0 w-full;
  text-shadow: 0 2px 8px var(--c-primary);
}

.character-message.show {
  animation: slideInMessage .7s ease-in-out forwards;
}
</style>