<template>
  <div
    ref="characterMessageEl"
    class="character-message"
  >
    <span 
      v-for="index in 3"
      :key="index"
      :class="`message t${index} ${helperClass}`"
    >
      {{ message.message }}
    </span>
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
    const showClass: string = 'show'
    const helperClass = ref('')
    const characterMessageEl = ref(null)

    // Computed
    const message = computed(() => store.getters['gameCharacter/message'])
    
    // Watchers
    watch(message, (newMessage) => {
      if (newMessage.message) {
        const el = characterMessageEl.value
        helperClass.value = newMessage.type
        el.classList.add(showClass)
        el.addEventListener('animationend', handleAnimationEnd)
      }
    })

    // Event Handlers
    const handleAnimationEnd = (event: AnimationEvent) => {
      event.stopPropagation()
      helperClass.value = ''
      store.dispatch('gameCharacter/resetMessage')
      characterMessageEl.value.classList.remove(showClass)
    }

    return {
      characterMessageEl,
      helperClass,
      message
    }
  }
})
</script>

<style scoped>
@keyframes slideInMessage {
  0% { 
    opacity: 0;
  }

  70% { 
    opacity: 1;
  }
  
  100% { 
    transform: translateY(-48px);
    opacity: 0;
  }
}

.character-message .t1,
.character-message .t2,
.character-message .t3 {
  @apply absolute font-bold text-center right-0 -top-24 w-full;
  text-shadow: 0 2px 8px var(--c-primary);
}

.character-message.show .t1,
.character-message.show .t2,
.character-message.show .t3 {
  animation: slideInMessage .8s ease-in-out both;
}

.character-message.show .t2 {
  animation-delay: .1s;
}

.character-message.show .t3 {
  animation-delay: .2s;
}

.message.powerup {
  @apply text-success;
}

.message.dislike {
  @apply text-danger;
}
</style>