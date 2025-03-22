<script setup lang="ts">
import CollectionItem from '@/components/ui/CollectionItem.vue'
import { useRouter } from 'vue-router'

interface Props {
  isLobby: boolean
  collections: GameCollection[]
  selectedCollections: GameCollection[]
}

const props = defineProps<Props>()

const emit = defineEmits([
  'forwardCollection',
])

const router = useRouter()

function isSelectedCollection(collection: GameCollection) {
  return props.selectedCollections.some(item => item.uid === collection.uid)
}

function handleShowCollection(uid: string) {
  router.push({ name: 'Collection', params: { uid } })
}
</script>

<template>
  <div
    id="list"
    class="text-center px-4 flex flex-col gap-4"
  >
    <div class="mb-2">
      <h2>
        <template v-if="isLobby">
          Choose your Collections
        </template>

        <template v-else>
          Your Word Collections
        </template>
      </h2>

      <p
        v-if="isLobby"
        class="text-primary text-xs"
      >
        Click and select up to <strong class="text-primary-light">4 collections</strong> to practice in the game
      </p>
    </div>

    <div class="grid grid-cols-2 gap-6 items-start auto-rows-min">
      <CollectionItem
        v-for="(collection, index) in collections"
        :key="index"
        :uid="collection.uid"
        :name="collection.name"
        :locales="collection.locales"
        :word-count="collection.words.length"
        :has-buttons="false"
        :selectable="isLobby"
        :is-selected="isSelectedCollection(collection)"
        @select-collection="() => emit('forwardCollection', collection)"
        @click-text="handleShowCollection"
      />
    </div>

    <div
      v-if="!isLobby"
      class="flex mt-4 items-center justify-center"
    >
      <Button
        to="collections"
        size="md"
        has-icon
      >
        See all Collections

        <Icon
          size="sm"
          stroke-width="4"
          name="chevronRight"
        />
      </Button>
    </div>
  </div>
</template>
