<script lang="ts" setup>
import SearchBar from '@/components/shared/SearchBar.vue'
import CollectionItem from '@/components/ui/CollectionItem.vue'
import PageContainer from '@/components/ui/PageContainer.vue'
import PageContent from '@/components/ui/PageContent.vue'
import { ToastService } from '@/services/ToastService'
import { useAppStore } from '@/stores/app.store'
import { useGameStore } from '@/stores/game.store'
import { useUserStore } from '@/stores/user.store'
import { isEmptyArray } from '@/utils'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()

const { t } = useI18n()
const userStore = useUserStore()
const gameStore = useGameStore()
const appStore = useAppStore()

const maxGameCollections = 4
const searchQuery = ref('')
const selectedCollections = ref<AppCollection[]>([])

const isReady = computed(() => selectedCollections.value.length > 0)

const hasItems = computed(() => !isEmptyArray(appStore.collections))

const filteredCollections = computed(() => {
  if (!appStore.collections) {
    return []
  }

  return appStore.collections.filter((collection: AppCollection) =>
    collection.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

function isSelectedCollection(collection: AppCollection) {
  return selectedCollections.value.some(item => item.id === collection.id)
}

function handleCollectionToggling(collection: AppCollection) {
  const index = selectedCollections.value.findIndex(item => item.id === collection.id)

  if (index !== -1) {
    selectedCollections.value.splice(index, 1)
  } else if (selectedCollections.value.length < maxGameCollections) {
    selectedCollections.value.push(collection)
  }
}

function handleRefillLivesRedirect() {
  if (!userStore.hasLives) {
    router.push({ name: 'Dashboard' })
  }
}

async function handleGameStart() {
  const rs = await gameStore.prepareGame(selectedCollections.value)

  if (rs) {
    router.push('game')
    return
  }

  ToastService.emitToast(t('failedToStartGame'), 'error')
  router.push('/')
}

onMounted(() => handleRefillLivesRedirect())
</script>

<template>
  <PageContainer
    :heading="$t('chooseYourCollections')"
    :subheading="$t('selectCollectionsGame')"
  >
    <PageContent
      :is-empty="!hasItems"
      :empty-heading="$t('noCollectionsFound')"
      :empty-byline="$t('createCollectionsToPlayWith')"
      empty-icon-name="collection"
    >
      <SearchBar
        v-if="hasItems"
        v-model="searchQuery"
      />

      <CollectionItem
        v-for="(collection, index) in filteredCollections"
        :id="collection.id"
        :key="index"
        :name="collection.name"
        :locale-original="collection.locale_original"
        :locale-learn="collection.locale_learn"
        :words-count="collection.words_count"
        :has-buttons="false"
        :selectable="true"
        :is-selected="isSelectedCollection(collection)"
        @select-collection="handleCollectionToggling(collection)"
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
            {{ $t('startGame') }}
          </template>

          <template v-else>
            {{ $t('selectSomeCollections') }}
          </template>
        </Button>
      </template>
    </PageContent>
  </PageContainer>
</template>
