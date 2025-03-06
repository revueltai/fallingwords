<script setup lang="ts">
import { dummyCollection } from '@/assets/dummyData'
import CollectionItem from '@/components/ui/CollectionItem.vue'
import { useGameStore } from '@/stores/game.store'
import { useRouter } from 'vue-router'

const router = useRouter()
const gameStore = useGameStore()

function handleGameStart() {
  gameStore.prepareGame({
    words: dummyCollection[0].words,
    locales: dummyCollection[0].locales,
  })

  router.push('game')
}
</script>

<template>
  <section class="">
    <div class="px-4 flex flex-col gap-6">
      <CollectionItem
        v-for="(collection, index) in dummyCollection"
        :key="index"
        :uid="collection.uid"
        :name="collection.name"
        :word-count="collection.words.length"
      />
    </div>

    <Button
      size="sm"
      @click="handleGameStart"
    >
      Play Game
    </Button>
  </section>
</template>
