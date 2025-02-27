<script setup lang="ts">
import { useGameCharacterStore } from '@/stores/gameCharacter.store'
import { ref, computed, watch } from 'vue'

const store = useGameCharacterStore()

const showClass = 'show'
const cssClasses = ref('')
const characterMessageRef = ref<HTMLElement | null>(null)

const message = computed(() => store.message)

function handleAnimationEnd (event: AnimationEvent) {
  event.stopPropagation()
  cssClasses.value = ''
  store.resetMessage()
  characterMessageRef.value?.classList.remove(showClass)
}

watch(message, (newMessage) => {
  if (newMessage.message && characterMessageRef.value) {
    cssClasses.value = newMessage.type
    characterMessageRef.value.classList.add(showClass)
    characterMessageRef.value.addEventListener('animationend', handleAnimationEnd)
  }
})
</script>

<template>
  <div
    ref="characterMessageRef"
    class="character-message"
  >
    <span
      v-for="index in 3"
      :key="index"
      :class="`absolute font-bold text-center right-0 -top-6 w-full message t${index} ${cssClasses}`"
    >
      {{ message.message }}
    </span>
  </div>
</template>

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

/* .message.powerup {
  @apply text-success;
}

.message.dislike {
  @apply text-danger;
} */
</style>
