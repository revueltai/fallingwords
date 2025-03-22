<script setup lang="ts">
import ListMessage from '@/components/shared/ListMessage.vue'
import ModalConfirm from '@/components/shared/modals/ModalConfirm.vue'
import Footer from '@/components/ui/Footer.vue'
import Header from '@/components/ui/Header.vue'
import WordItem from '@/components/ui/WordItem.vue'
import ModalWordCreate from '@/components/words/ModalWordCreate.vue'
import ModalWordUpdate from '@/components/words/ModalWordUpdate.vue'
import { useAppStore } from '@/stores/app.store'
import { useModalStore } from '@/stores/modal.store'
import { isEmptyArray } from '@/utils'
import { toastEmitter } from '@/utils/ToastEmitter'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

interface WordPayload {
  original: string
  learn: string
}

const route = useRoute()

const appStore = useAppStore()
const modalStore = useModalStore()

const ModalComponentMap = {
  create: ModalWordCreate,
  update: ModalWordUpdate,
  delete: ModalConfirm,
}

const selectedCollection = ref<GameCollection | null>(null)
const selectedWordUid = ref<string | null>(null)

const actions = ref<CrudActions>('create')

const modalComponent = computed(() => (ModalComponentMap as any)[actions.value] || null)

function resetModal() {
  modalStore.closeModal()
}

function getModalProps(): ModalProps {
  const actionProps = {
    delete: {
      onDelete: handleDelete,
      heading: 'Are you sure you want to delete this Word?',
      iconName: 'trashbin',
      ctaText: 'Delete',
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
  modalStore.openModal()
}

function handleShowUpdateCollection(uid: string) {
  actions.value = 'update'
  selectedWordUid.value = uid
  modalStore.openModal()
}

function handleShowDeleteCollection(uid: string) {
  actions.value = 'delete'
  selectedWordUid.value = uid
  modalStore.openModal()
}

function handleDelete() {
  const rs = appStore.deleteWord(selectedCollection.value?.uid, selectedWordUid.value)

  if (rs) {
    resetModal()
    toastEmitter.emit('toast', { message: 'Word deleted', type: 'success' })
  }
}

async function handleCreate(payload: WordPayload) {
  if (!(payload.original && payload.learn)) {
    toastEmitter.emit('toast', { message: 'Cannot save Word', type: 'error' })
    return
  }

  const rs = await appStore.createWord(selectedCollection.value?.uid, payload)

  if (rs) {
    resetModal()
    toastEmitter.emit('toast', { message: 'Word created!', type: 'success' })
  } else {
    toastEmitter.emit('toast', { message: 'Failed to create Word', type: 'error' })
  }
}

async function handleUpdate(payload: WordPayload) {
  if (!(payload.original && payload.learn)) {
    toastEmitter.emit('toast', { message: 'Cannot save Word', type: 'error' })
    return
  }

  const rs = await appStore.updateWord(selectedCollection.value?.uid, {
    uid: selectedWordUid.value,
    original: payload.original,
    learn: payload.learn,
  })

  if (rs) {
    toastEmitter.emit('toast', { message: 'Word saved!', type: 'success' })
    resetModal()
  } else {
    toastEmitter.emit('toast', { message: 'Failed to save Word', type: 'error' })
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
  <Header
    :heading="['Collections', String(selectedCollection?.name)]"
    return-path="collections"
  />

  <div class="relative h-full overflow-y-auto pt-16 pb-28">
    <div class="grid gap-6 items-start auto-rows-min px-4 h-full anim-fade-in-timed">
      <ListMessage
        v-if="!selectedCollection || isEmptyArray(selectedCollection.words)"
        icon-name="word"
        icon-type="fill"
        heading="No Words in this Collection yet"
        byline="Add your first word"
      />

      <template v-else>
        <WordItem
          v-for="(word, index) in selectedCollection.words"
          :key="index"
          :uid="word.uid"
          :original="word.original"
          :learn="word.learn"
          :locales="selectedCollection.locales"
          @update="handleShowUpdateCollection"
          @delete="handleShowDeleteCollection"
        />
      </template>
    </div>
  </div>

  <Footer>
    <Button
      background-color="tertiary"
      border-color="tertiary-light"
      size="md"
      class="min-w-48"
      @click="handleShowCreateWord"
    >
      Add a Word
    </Button>
  </Footer>

  <Modal>
    <Component
      :is="modalComponent"
      v-bind="getModalProps()"
    />
  </Modal>
</template>
