<script setup lang="ts">
import PageWrapper from '@/components/shared/PageWrapper.vue'
import SearchBar from '@/components/shared/SearchBar.vue'
import AppList from '@/components/ui/AppList.vue'
import CollectionItem from '@/components/ui/CollectionItem.vue'
import ModalCollectionCreate from '@/components/ui/modals/ModalCollectionCreate.vue'
import ModalCollectionUpdate from '@/components/ui/modals/ModalCollectionUpdate.vue'
import ModalConfirm from '@/components/ui/modals/ModalConfirm.vue'
import { useAppStore } from '@/stores/app.store'
import { useModalStore } from '@/stores/modal.store'
import { isEmptyArray } from '@/utils'
import { toastEmitter } from '@/utils/ToastEmitter'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const appStore = useAppStore()
const modalStore = useModalStore()

const ModalComponentMap = {
  create: ModalCollectionCreate,
  update: ModalCollectionUpdate,
  delete: ModalConfirm,
}

const searchQuery = ref('')
const selectedCollectionUid = ref<string | null>(null)
const actions = ref<CrudActions>('create')

const filteredCollections = computed(() => {
  if (!appStore.collections) {
    return []
  }

  return appStore.collections.filter((collection: GameCollection) =>
    collection.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const modalComponent = computed(() => (ModalComponentMap as any)[actions.value] || null)

function resetModal() {
  modalStore.closeModal()
  selectedCollectionUid.value = null
}

function getModalProps(): ModalProps {
  const actionProps = {
    delete: {
      onDelete: handleDelete,
      heading: 'Are you sure you want to delete this Collection?',
      byline: 'All words in it will be removed too',
      iconName: 'trashbin',
      ctaText: 'Delete',
      eventName: 'delete',
      eventCallbackParams: selectedCollectionUid.value,
    },
    create: {
      onCreate: handleCreate,
    },
    update: {
      onUpdate: handleUpdate,
    },
  }

  return actionProps[actions.value] || {}
}

function handleShowViewCollection(uid: string) {
  router.push({ name: 'Collection', params: { uid } })
}

function handleShowCreateCollection() {
  actions.value = 'create'
  modalStore.openModal()
}

function handleShowUpdateCollection(uid: string) {
  actions.value = 'update'
  selectedCollectionUid.value = uid
  modalStore.openModal()
}

function handleShowDeleteCollection(uid: string) {
  actions.value = 'delete'
  selectedCollectionUid.value = uid
  modalStore.openModal()
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
</script>

<template>
  <PageWrapper>
    <div class="flex flex-col gap-3">
      <Breadcrumbs :breadcrumbs="['Collections']" />
      <SearchBar v-model="searchQuery" />
    </div>

    <AppList
      columns="1"
      :is-empty="isEmptyArray(appStore.collections)"
      empty-heading="No Collections Found"
      empty-byline="Create some collections to play with"
      empty-icon-name="collection"
    >
      <CollectionItem
        v-for="(collection, index) in filteredCollections"
        :key="index"
        :uid="collection.uid"
        :name="collection.name"
        :locales="collection.locales"
        :word-count="collection.words.length"
        :has-buttons="true"
        @click-text="handleShowViewCollection"
        @update="handleShowUpdateCollection"
        @delete="handleShowDeleteCollection"
      />

      <template #footer>
        <Button
          background-color="tertiary"
          border-color="tertiary-light"
          size="md"
          class="min-w-48"
          @click="handleShowCreateCollection"
        >
          Add a Collection
        </Button>
      </template>
    </AppList>
  </PageWrapper>

  <Modal>
    <Component
      :is="modalComponent"
      :uid="selectedCollectionUid"
      v-bind="getModalProps()"
    />
  </Modal>
</template>
