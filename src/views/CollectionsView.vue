<script setup lang="ts">
import SearchBar from '@/components/shared/SearchBar.vue'
import CollectionItem from '@/components/ui/CollectionItem.vue'
import ModalCollectionCreate from '@/components/ui/modals/ModalCollectionCreate.vue'
import ModalCollectionUpdate from '@/components/ui/modals/ModalCollectionUpdate.vue'
import ModalConfirm from '@/components/ui/modals/ModalConfirm.vue'
import PageContainer from '@/components/ui/PageContainer.vue'
import PageContent from '@/components/ui/PageContent.vue'
import { MODAL_NAMES } from '@/configs/constants'
import { ToastService } from '@/services/ToastService'
import { useAppStore } from '@/stores/app.store'
import { useModalStore } from '@/stores/modal.store'
import { isEmptyArray } from '@/utils'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()

const { t } = useI18n()
const appStore = useAppStore()
const modalStore = useModalStore()

const ModalComponentMap = {
  create: ModalCollectionCreate,
  update: ModalCollectionUpdate,
  delete: ModalConfirm,
}

const activeModal = ref<ModalConfig | null>(null)
const searchQuery = ref('')
const selectedCollectionUid = ref<string | null>(null)
const actions = ref<CrudActions>('create')

const filteredCollections = computed(() => {
  if (!appStore.collections) {
    return []
  }

  return appStore.collections.filter((collection: AppCollection) =>
    collection.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const hasItems = computed(() => isEmptyArray(appStore.collections))

const modalComponent = computed(() => {
  return activeModal.value
    ? (ModalComponentMap as any)[actions.value]
    : null
})

function resetModal() {
  modalStore.closeModal()
  selectedCollectionUid.value = null
}

function getModalProps(): ModalProps {
  const actionProps = {
    delete: {
      onDelete: handleDelete,
      heading: t('confirmDeleteCollection'),
      byline: t('confirmDeleteCollectionInfo'),
      ctaText: t('delete'),
      iconName: 'trashbin',
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

function handleShowViewCollection(id: string) {
  router.push({ name: 'Collection', params: { uid: id } })
}

function handleShowCreateCollection() {
  actions.value = 'create'
  activeModal.value = {
    name: MODAL_NAMES.collections,
    heading: 'addACollection',
  }

  modalStore.openModal(activeModal.value.name)
}

function handleShowUpdateCollection(id: string) {
  selectedCollectionUid.value = id

  actions.value = 'update'
  activeModal.value = {
    name: MODAL_NAMES.collections,
    heading: 'updateCollection',
  }

  modalStore.openModal(activeModal.value.name)
}

function handleShowDeleteCollection(uid: string) {
  selectedCollectionUid.value = uid

  actions.value = 'delete'
  activeModal.value = {
    name: MODAL_NAMES.collections,
    heading: 'deleteCollection',
  }

  modalStore.openModal(activeModal.value.name)
}

function handleDelete(id: string) {
  const rs = appStore.deleteCollection(id)

  if (rs) {
    resetModal()
    ToastService.emitToast(t('collectionDeleted'), 'success')
    return
  }

  ToastService.emitToast(t('collectionDeletedFailed'), 'error')
}

function handleCreate(payload: CollectionUpdate) {
  const rs = appStore.createCollection(payload)

  if (rs) {
    resetModal()
    ToastService.emitToast(t('collectionCreated'), 'success')
  } else {
    ToastService.emitToast(t('collectionCreateError'), 'error')
  }
}

async function handleUpdate(payload: CollectionUpdate) {
  if (payload.localeOriginal === payload.localeLearn) {
    ToastService.emitToast(t('collectionSameLanguageError'), 'error')
    return
  }

  const rs = await appStore.updateCollection(payload)

  if (rs) {
    resetModal()
    ToastService.emitToast(t('collectionUpdated'), 'success')
  } else {
    ToastService.emitToast(t('collectionUpdateError'), 'error')
  }
}
</script>

<template>
  <PageContainer :heading="$t('collections')">
    <div
      v-if="!hasItems"
      class="flex flex-col gap-3"
    >
      <Breadcrumbs :breadcrumbs="[$t('collections')]" />
      <SearchBar v-model="searchQuery" />
    </div>

    <PageContent
      columns="1"
      :is-empty="hasItems"
      :empty-heading="$t('noCollectionsFound')"
      :empty-byline="$t('createCollectionsToPlayWith')"
      empty-icon-name="collection"
    >
      <CollectionItem
        v-for="(collection, index) in filteredCollections"
        :id="collection.id"
        :key="index"
        :name="collection.name"
        :locale-original="collection.locale_original"
        :locale-learn="collection.locale_learn"
        :words-count="collection.words_count"
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
          {{ $t('addACollection') }}
        </Button>
      </template>
    </PageContent>

    <Modal
      :name="activeModal ? activeModal.name : ''"
      :heading="(activeModal && activeModal.heading) ? $t(activeModal.heading) : ''"
    >
      <Component
        :is="modalComponent"
        :uid="selectedCollectionUid"
        v-bind="getModalProps()"
      />
    </Modal>
  </PageContainer>
</template>
