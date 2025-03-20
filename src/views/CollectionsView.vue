<script setup lang="ts">
import CollectionOverlayCreate from '@/components/collections/overlays/CollectionOverlayCreate.vue'
import CollectionOverlayDelete from '@/components/collections/overlays/CollectionOverlayDelete.vue'
import CollectionOverlayUpdate from '@/components/collections/overlays/CollectionOverlayUpdate.vue'
import ListMessage from '@/components/shared/ListMessage.vue'
import Modal from '@/components/shared/Modal.vue'
import CollectionItem from '@/components/ui/CollectionItem.vue'
import Footer from '@/components/ui/Footer.vue'
import Header from '@/components/ui/Header.vue'
import { useAppStore } from '@/stores/app.store'
import { isEmptyArray } from '@/utils'
import { toastEmitter } from '@/utils/ToastEmitter'
import { computed, onMounted, ref } from 'vue'

type CollectionActions = 'create' | 'update' | 'delete'

interface OverlayListeners {
  onDelete?: (uid: string) => void
  onCreate?: (payload: CollectionUpdate) => void
  onUpdate?: (payload: CollectionUpdate) => void
}

const appStore = useAppStore()

const ModalComponentMap = {
  create: CollectionOverlayCreate,
  update: CollectionOverlayUpdate,
  delete: CollectionOverlayDelete,
}

const isModalOpen = ref(false)
const selectedUid = ref<string | null>(null)

const actions = ref<CollectionActions>('create')

const overlayComponent = computed(() => (ModalComponentMap as any)[actions.value] || null)

function resetModal() {
  isModalOpen.value = false
  selectedUid.value = null
}

function handleShowCreateCollection() {
  actions.value = 'create'
  isModalOpen.value = true
}

function handleShowUpdateCollection(uid: string) {
  actions.value = 'update'
  isModalOpen.value = true
  selectedUid.value = uid
}

function handleShowDeleteCollection(uid: string) {
  actions.value = 'delete'
  isModalOpen.value = true
  selectedUid.value = uid
}

function handleDelete(uid: string) {
  const rs = appStore.deleteCollection(uid)

  if (rs) {
    resetModal()
    toastEmitter.emit('toast', { message: 'Collection deleted', type: 'success' })
  }
}

function handleCreate(payload: CollectionUpdate) {
  const rs = appStore.createCollection(payload)

  if (rs) {
    resetModal()
    toastEmitter.emit('toast', { message: 'Collection created!', type: 'success' })
  } else {
    toastEmitter.emit('toast', { message: 'Failed to create Collection', type: 'error' })
  }
}

async function handleUpdate(payload: CollectionUpdate) {
  if (payload.localeOriginal === payload.localeLearn) {
    toastEmitter.emit('toast', { message: 'Cannot save the same language', type: 'error' })
    return
  }

  const rs = await appStore.updateCollection(payload)
  if (rs) {
    toastEmitter.emit('toast', { message: 'Collection saved!', type: 'success' })
    resetModal()
  } else {
    toastEmitter.emit('toast', { message: 'Failed to update Collection', type: 'error' })
  }
}

function getOverlayListeners(): OverlayListeners {
  const listeners: OverlayListeners = {}

  if (actions.value === 'delete') {
    listeners.onDelete = handleDelete
  }

  if (actions.value === 'create') {
    listeners.onCreate = handleCreate
  }

  if (actions.value === 'update') {
    listeners.onUpdate = handleUpdate
  }

  return listeners
}

onMounted(async () => await appStore.setCollections())
</script>

<template>
  <div class="relative h-full overflow-y-auto pt-16 pb-28">
    <Header />

    <div class="grid gap-6 items-start auto-rows-min px-4 h-full anim-fade-in-timed">
      <ListMessage
        v-if="isEmptyArray(appStore.collections)"
        icon-name="collection"
        heading="No Collections yet"
        byline="Add your first collection"
      />

      <template v-else>
        <CollectionItem
          v-for="(collection, index) in appStore.collections"
          :key="index"
          :uid="collection.uid"
          :name="collection.name"
          :locales="collection.locales"
          :word-count="collection.words.length"
          :has-buttons="true"
          @update="handleShowUpdateCollection"
          @delete="handleShowDeleteCollection"
        />
      </template>
    </div>

    <Footer>
      <Button
        background-color="tertiary"
        border-color="tertiary-light"
        size="md"
        @click="handleShowCreateCollection"
      >
        Add a Collection
      </Button>
    </Footer>
  </div>

  <Modal
    container-el="modal"
    :is-open="isModalOpen"
    :has-close-button="true"
    @on-close="isModalOpen = false"
  >
    <Component
      :is="overlayComponent"
      :uid="selectedUid"
      v-bind="getOverlayListeners()"
    />
  </Modal>
</template>
