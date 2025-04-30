<script setup lang="ts">
import SearchBar from '@/components/shared/SearchBar.vue'
import ModalConfirm from '@/components/ui/modals/ModalConfirm.vue'
import PageContainer from '@/components/ui/PageContainer.vue'
import PageContent from '@/components/ui/PageContent.vue'

import WordItem from '@/components/ui/WordItem.vue'
import ModalWordCreate from '@/components/words/ModalWordCreate.vue'
import ModalWordUpdate from '@/components/words/ModalWordUpdate.vue'
import { MODAL_NAMES } from '@/configs/constants'
import { ToastService } from '@/services/ToastService'
import { useAppStore } from '@/stores/app.store'
import { useModalStore } from '@/stores/modal.store'
import { useSettingsStore } from '@/stores/settings.store'
import { isEmptyArray } from '@/utils'
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
const settingsStore = useSettingsStore()
const modalStore = useModalStore()

const ModalComponentMap = {
  create: ModalWordCreate,
  update: ModalWordUpdate,
  delete: ModalConfirm,
}

const activeModal = ref<ModalConfig | null>(null)
const searchQuery = ref('')
const selectedCollection = ref<AppCollection | null>(null)
const selectedWordUid = ref<string | null>(null)
const actions = ref<CrudActions>('create')

const filteredWords = computed(() => {
  if (!selectedCollection.value) {
    return []
  }

  const collectionId = selectedCollection.value?.id

  if (!collectionId) {
    return []
  }

  const words = appStore.collectionWords[collectionId] || []
  if (!searchQuery.value) {
    return words
  }

  return words.filter((word: AppWord) =>
    word.original.toLowerCase().includes(searchQuery.value.toLowerCase())
    || word.learn.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const hasItems = computed(() => !isEmptyArray(filteredWords.value))

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
      eventCallbackParams: selectedCollection.value?.id,
    },
    create: {
      onCreate: handleCreate,
      localeOriginal: selectedCollection.value?.locale_original,
      localeLearn: selectedCollection.value?.locale_learn,
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
  activeModal.value = {
    name: MODAL_NAMES.words,
    heading: 'addAWord',
  }

  modalStore.openModal(activeModal.value.name)
}

function handleShowUpdateCollection(id: string) {
  selectedWordUid.value = id

  actions.value = 'update'
  activeModal.value = {
    name: MODAL_NAMES.words,
    heading: 'updateWord',
  }

  modalStore.openModal(activeModal.value.name)
}

function handleShowDeleteCollection(id: string) {
  selectedWordUid.value = id

  actions.value = 'delete'
  activeModal.value = {
    name: MODAL_NAMES.words,
    heading: 'deleteWord',
  }

  modalStore.openModal(activeModal.value.name)
}

function handleDelete() {
  const rs = appStore.deleteWord(selectedCollection.value?.id, selectedWordUid.value)

  if (rs) {
    resetModal()
    ToastService.emitToast(t('wordDeleted'), 'success')
  }
}

async function handleCreate(payload: WordPayload) {
  if (!(payload.original && payload.learn)) {
    ToastService.emitToast(t('cannotSaveWord'), 'error')
    return
  }

  try {
    const rs = await appStore.createWord(selectedCollection.value?.id, payload)
    resetModal()

    ToastService.emitToast(t('wordCreated'), 'success')

    return rs
  } catch (error: any) {
    if (error.message === 'MaxWordsLimitReached') {
      ToastService.emitToast(t('collectionWordLimitReached'), 'error')
    } else {
      ToastService.emitToast(t('failedToCreateWord'), 'error')
      console.error('Failed to create word:', error)
    }
  }
}

async function handleUpdate(payload: WordPayload) {
  if (!(payload.original && payload.learn)) {
    ToastService.emitToast(t('cannotSaveWord'), 'error')
    return
  }

  const rs = await appStore.updateWord(selectedCollection.value?.id, {
    uid: selectedWordUid.value,
    original: payload.original,
    learn: payload.learn,
  })

  if (rs) {
    ToastService.emitToast(t('wordSaved'), 'success')
    resetModal()
  } else {
    ToastService.emitToast(t('failedToSaveWord'), 'error')
  }
}

onMounted(async () => {
  const collection = await appStore.getCollectionById(route.params.uid)

  if (collection) {
    selectedCollection.value = collection
    appStore.fetchCollectionWords(selectedCollection.value?.id)
  }
})
</script>

<template>
  <PageContainer :heading="$t('collectionWords')">
    <div class="flex flex-col gap-3">
      <Breadcrumbs :breadcrumbs="[$t('collections'), String(selectedCollection?.name)]" />

      <SearchBar
        v-if="hasItems"
        v-model="searchQuery"
        :is-visible="hasItems"
      />
    </div>

    <PageContent
      columns="1"
      :is-empty="!hasItems"
      :empty-heading="$t('noWordsInCollection')"
      :empty-byline="$t('addYourFirstWord')"
      empty-icon-name="word"
      empty-icon-stroke="stroke"
    >
      <WordItem
        v-for="(word, index) in filteredWords"
        :key="index"
        :uid="word.uid"
        :original="word.original"
        :learn="word.learn"
        :locale-original="selectedCollection?.locale_original!"
        :locale-learn="selectedCollection?.locale_learn!"
        @update="handleShowUpdateCollection"
        @delete="handleShowDeleteCollection"
      />

      <p
        v-if="settingsStore.maxWordsPerCollection"
        class="text-sm text-grey"
      >
        {{ $t('collectionWordLimit', { limit: settingsStore.maxWordsPerCollection }) }}
      </p>

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

    <Modal
      :name="activeModal ? activeModal.name : ''"
      :heading="(activeModal && activeModal.heading) ? $t(activeModal.heading) : ''"
    >
      <Component
        :is="modalComponent"
        v-bind="getModalProps()"
      />
    </Modal>
  </PageContainer>
</template>
