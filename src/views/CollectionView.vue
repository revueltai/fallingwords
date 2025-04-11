<script setup lang="ts">
import SearchBar from '@/components/shared/SearchBar.vue'
import ModalConfirm from '@/components/ui/modals/ModalConfirm.vue'
import PageContainer from '@/components/ui/PageContainer.vue'
import PageContent from '@/components/ui/PageContent.vue'

import WordItem from '@/components/ui/WordItem.vue'
import ModalWordCreate from '@/components/words/ModalWordCreate.vue'
import ModalWordUpdate from '@/components/words/ModalWordUpdate.vue'
import { MODAL_NAMES } from '@/configs/constants'
import { useAppStore } from '@/stores/app.store'
import { useModalStore } from '@/stores/modal.store'
import { isEmptyArray } from '@/utils'
import { emitToast } from '@/utils/ToastEmitter'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

interface WordPayload {
  original: string
  learn: string
}

const route = useRoute()

const { t } = useI18n()
const appStore = useAppStore()
const modalStore = useModalStore()

const ModalComponentMap = {
  create: ModalWordCreate,
  update: ModalWordUpdate,
  delete: ModalConfirm,
}

const searchQuery = ref('')
const selectedCollection = ref<GameCollection | null>(null)
const selectedWordUid = ref<string | null>(null)
const actions = ref<CrudActions>('create')

const filteredWords = computed(() => {
  if (!selectedCollection.value) {
    return []
  }

  return selectedCollection.value.words.filter(word =>
    word.original.toLowerCase().includes(searchQuery.value.toLowerCase())
    || word.learn.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const hasItems = computed(() => !!(selectedCollection.value && isEmptyArray(selectedCollection.value.words)))

const modalComponent = computed(() => (ModalComponentMap as any)[actions.value] || null)

function resetModal() {
  modalStore.closeModal()
}

function getModalProps(): ModalProps {
  const actionProps = {
    delete: {
      onDelete: handleDelete,
      heading: t('confirmDeleteWord'),
      ctaText: t('delete'),
      iconName: 'trashbin',
      eventName: 'delete',
    },
    create: {
      onCreate: handleCreate,
      locales: selectedCollection.value?.locales,
    },
    update: {
      onUpdate: handleUpdate,
      collection: selectedCollection.value,
      wordUid: selectedWordUid.value,
    },
  }

  return actionProps[actions.value] || {}
}

function handleShowCreateWord() {
  actions.value = 'create'
  modalStore.openModal(MODAL_NAMES.words)
}

function handleShowUpdateCollection(uid: string) {
  actions.value = 'update'
  selectedWordUid.value = uid
  modalStore.openModal(MODAL_NAMES.words)
}

function handleShowDeleteCollection(uid: string) {
  actions.value = 'delete'
  selectedWordUid.value = uid
  modalStore.openModal(MODAL_NAMES.words)
}

function handleDelete() {
  const rs = appStore.deleteWord(selectedCollection.value?.uid, selectedWordUid.value)

  if (rs) {
    resetModal()
    emitToast(t('wordDeleted'), 'success')
  }
}

async function handleCreate(payload: WordPayload) {
  if (!(payload.original && payload.learn)) {
    emitToast(t('cannotSaveWord'), 'error')
    return
  }

  const rs = await appStore.createWord(selectedCollection.value?.uid, payload)

  if (rs) {
    resetModal()
    emitToast(t('wordCreated'), 'success')
  } else {
    emitToast(t('failedToCreateWord'), 'error')
  }
}

async function handleUpdate(payload: WordPayload) {
  if (!(payload.original && payload.learn)) {
    emitToast(t('cannotSaveWord'), 'error')
    return
  }

  const rs = await appStore.updateWord(selectedCollection.value?.uid, {
    uid: selectedWordUid.value,
    original: payload.original,
    learn: payload.learn,
  })

  if (rs) {
    emitToast(t('wordSaved'), 'success')
    resetModal()
  } else {
    emitToast(t('failedToSaveWord'), 'error')
  }
}

onMounted(async () => {
  const collection = await appStore.getCollectionById(route.params.uid)

  if (collection) {
    selectedCollection.value = collection
  }
})
</script>

<template>
  <PageContainer :heading="$t('collectionWords')">
    <div class="flex flex-col gap-3">
      <Breadcrumbs :breadcrumbs="[$t('collections'), String(selectedCollection?.name)]" />
      <SearchBar
        v-if="!hasItems"
        v-model="searchQuery"
        :is-visible="hasItems"
      />
    </div>

    <PageContent
      columns="1"
      :is-empty="hasItems"
      :empty-heading="$t('noWordsInCollection')"
      :empty-byline="$t('addYourFirstWord')"
      empty-icon-name="word"
    >
      <WordItem
        v-for="(word, index) in filteredWords"
        :key="index"
        :uid="word.uid"
        :original="word.original"
        :learn="word.learn"
        :locales="selectedCollection?.locales!"
        @update="handleShowUpdateCollection"
        @delete="handleShowDeleteCollection"
      />

      <template #footer>
        <Button
          background-color="tertiary"
          border-color="tertiary-light"
          size="md"
          class="min-w-48"
          @click="handleShowCreateWord"
        >
          {{ $t('addAWord') }}
        </Button>
      </template>
    </PageContent>

    <Modal :name="MODAL_NAMES.words">
      <Component
        :is="modalComponent"
        v-bind="getModalProps()"
      />
    </Modal>
  </PageContainer>
</template>
