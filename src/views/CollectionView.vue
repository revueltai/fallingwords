<script setup lang="ts">
import SearchBar from '@/components/shared/SearchBar.vue'
import ModalCollectionPackageUpdate from '@/components/ui/modals/ModalCollectionPackageUpdate.vue'
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
import { isEmptyArray, isEmptyObject } from '@/utils'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()

const { t } = useI18n()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const modalStore = useModalStore()

const ModalComponentMap = {
  create: ModalWordCreate,
  update: ModalWordUpdate,
  delete: ModalConfirm,
  updateCollectionPackage: ModalCollectionPackageUpdate,
}

const activeModal = ref<ModalConfig | null>(null)
const searchQuery = ref('')
const selectedCollectionId = ref<string | null>(null)

const selectedCollection = computed(() => {
  if (!selectedCollectionId.value) {
    return null
  }

  return appStore.collections.find((c: any) => c.id === selectedCollectionId.value) || null
})

const selectedWordUid = ref<string | null>(null)
const actions = ref<CrudActions | 'updateCollectionPackage'>('create')

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

const collectionWordsLimit = computed(() => {
  if (!selectedCollection.value || !selectedCollection.value.collection_package_name) {
    return false
  }

  return settingsStore.appCollectionPackages.find(item => item.id === selectedCollection.value!.collection_package_name)?.value
})

const hasMaxCollectionWords = computed(() => {
  if (!selectedCollection.value || !collectionWordsLimit.value) {
    return false
  }

  const wordsCount = selectedCollection.value.words_count
  return collectionWordsLimit.value && wordsCount >= collectionWordsLimit.value
})

const hasItems = computed(() => !isEmptyArray(filteredWords.value))

const modalComponent = computed(() => (ModalComponentMap as any)[actions.value] || null)

const isLastPackage = computed(() => {
  const lastPackageIndex = settingsStore.appCollectionPackagesOrder.length - 1
  return selectedCollection.value && selectedCollection.value.collection_package_name === settingsStore.appCollectionPackagesOrder[lastPackageIndex]
})

const buttonText = computed(() => {
  if (hasMaxCollectionWords.value) {
    return 'expandCollectionLimit'
  }

  return 'addAWord'
})

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
    updateCollectionPackage: {
      onUpdate: handleUpdateCollectionPackage,
      collection: selectedCollection.value,
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

function handleShowExpandCollectionLimit() {
  actions.value = 'updateCollectionPackage'

  activeModal.value = {
    name: MODAL_NAMES.collectionPackages,
    heading: 'expandCollectionLimit',
    byline: 'expandCollectionLimitDescription',
  }

  modalStore.openModal(activeModal.value.name)
}

function handleShowUpdateWord(id: string) {
  selectedWordUid.value = id

  actions.value = 'update'
  activeModal.value = {
    name: MODAL_NAMES.words,
    heading: 'updateWord',
  }

  modalStore.openModal(activeModal.value.name)
}

function handleShowDeleteWord(id: string) {
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

async function handleCreate(payload: AppWordPayload) {
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

async function handleUpdate(payload: AppWordPayload) {
  if (!(payload.original && payload.learn)) {
    ToastService.emitToast(t('cannotSaveWord'), 'error')
    return
  }

  const rs = await appStore.updateWord(selectedCollection.value?.id, {
    uid: selectedWordUid.value,
    original: payload.original,
    learn: payload.learn,
    originalArticle: payload.originalArticle,
    learnArticle: payload.learnArticle,
    type: payload.wordType,
  })

  if (rs) {
    ToastService.emitToast(t('wordSaved'), 'success')
    resetModal()
  } else {
    ToastService.emitToast(t('failedToSaveWord'), 'error')
  }
}

async function handleUpdateCollectionPackage(payload: { packageTypeName: string, collectionId: string }) {
  if (!selectedCollection.value || isEmptyObject(payload) || payload.collectionId !== selectedCollection.value?.id) {
    ToastService.emitToast(t('collectionPackagageNameFail'), 'error')
    return
  }

  const rs = await appStore.updateCollectionPackageType({
    uid: payload.collectionId,
    collectionPackageName: payload.packageTypeName,
  })

  if (rs.success) {
    ToastService.emitToast(t('collectionPackageUpdated'), 'success')
    resetModal()
  } else {
    ToastService.emitToast(t(rs.errorCode || 'failedUpdatePackage'), 'error')
  }
}

function handleClick() {
  if (isLastPackage.value) {
    return
  }

  if (hasMaxCollectionWords.value) {
    handleShowExpandCollectionLimit()
    return
  }

  handleShowCreateWord()
}

onMounted(async () => {
  const collection = await appStore.getCollectionById(route.params.uid)

  if (collection) {
    selectedCollectionId.value = collection.id
    appStore.fetchCollectionWords(collection.id)
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
        :word-type="word.type"
        :original="word.original"
        :learn="word.learn"
        :original-article="word.originalArticle"
        :learn-article="word.learnArticle"
        :locale-original="selectedCollection?.locale_original!"
        :locale-learn="selectedCollection?.locale_learn!"
        @update="handleShowUpdateWord"
        @delete="handleShowDeleteWord"
      />

      <div
        class="text-sm flex gap-4"
        :class="hasMaxCollectionWords ? 'text-quaternary-light' : 'text-grey'"
      >
        <p
          v-if="selectedCollection"
          class="flex-none"
        >
          {{ selectedCollection.words_count }} / {{ collectionWordsLimit }}
        </p>

        <div
          v-if="hasMaxCollectionWords"
          class="flex-1"
        >
          {{ $t('collectionWordLimitReached') }}.

          <div v-if="!isLastPackage">
            {{ $t('collectionWordLimit') }}
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          v-if="!(isLastPackage && hasMaxCollectionWords)"
          background-color="tertiary"
          border-color="tertiary-light"
          size="md"
          class="min-w-48"
          @click="handleClick"
        >
          {{ $t(buttonText) }}
        </Button>
      </template>
    </PageContent>

    <Modal
      :name="activeModal ? activeModal.name : ''"
      :heading="(activeModal && activeModal.heading) ? $t(activeModal.heading) : ''"
      :byline="(activeModal && activeModal.byline) ? $t(activeModal.byline) : ''"
    >
      <Component
        :is="modalComponent"
        v-bind="getModalProps()"
      />
    </Modal>
  </PageContainer>
</template>
