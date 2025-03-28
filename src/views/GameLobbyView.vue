<script lang="ts" setup>
import AppList from '@/components/ui/AppList.vue'
import CollectionItem from '@/components/ui/CollectionItem.vue'
import { useAppStore } from '@/stores/app.store'
import { useGameStore } from '@/stores/game.store'
import { isEmptyArray } from '@/utils'
import { toastEmitter } from '@/utils/ToastEmitter'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const gameStore = useGameStore()
const appStore = useAppStore()

const maxGameCollections = 4
const selectedCollections = ref<GameCollection[]>([])

const isReady = computed(() => selectedCollections.value.length > 0)

function isSelectedCollection(collection: GameCollection) {
  return selectedCollections.value.some(item => item.uid === collection.uid)
}

function handleCollectionToggling(collection: GameCollection) {
  const index = selectedCollections.value.findIndex(item => item.uid === collection.uid)

  if (index !== -1) {
    selectedCollections.value.splice(index, 1)
  } else if (selectedCollections.value.length < maxGameCollections) {
    selectedCollections.value.push(collection)
  }
}

function handleGameStart() {
  gameStore.setGameCollections(selectedCollections.value)
  const rs = gameStore.prepareGame()

  if (rs) {
    router.push('game')
  } else {
    toastEmitter.emit('toast', { message: 'Failed to start game', type: 'error' })
    router.push('/')
  }
}
</script>

<template>
  <PageWrapper>
    <TextBlock
      heading="Choose your Collections"
      subheading="Select up to 4 collections to play with"
    />

    <AppList
      :is-empty="isEmptyArray(appStore.collections)"
      empty-heading="No Collections Found"
      empty-byline="Create some collections to play with"
      empty-icon-name="collection"
    >
      <CollectionItem
        v-for="(collection, index) in appStore.collections"
        :key="index"
        :uid="collection.uid"
        :name="collection.name"
        :locales="collection.locales"
        :word-count="collection.words.length"
        :has-buttons="false"
        :selectable="true"
        :is-selected="isSelectedCollection(collection)"
        @select-collection="() => handleCollectionToggling(collection)"
      />

      <template #footer>
        <Button
          background-color="tertiary"
          border-color="tertiary-light"
          size="md"
          :disabled="!isReady"
          class="min-w-48"
          @click="handleGameStart"
        >
          <template v-if="isReady">
            Start Game!
          </template>
          <template v-else>
            Select some Collections
          </template>
        </Button>
      </template>
    </AppList>
  </PageWrapper>
</template>
