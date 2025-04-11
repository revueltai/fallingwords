<script setup lang="ts">
import AppFirstSessionSteps from '@/components/ui/AppFirstSessionSteps.vue'
import ModalCredits from '@/components/ui/modals/ModalCredits.vue'
import ModalLogin from '@/components/ui/modals/ModalLogin.vue'
import PageContainer from '@/components/ui/PageContainer.vue'
import { useErrorService } from '@/composables/useErrorService'
import { MODAL_NAMES } from '@/configs/constants'
import { supabase } from '@/services/SupabaseService'
import { useAppStore } from '@/stores/app.store'
import { useModalStore } from '@/stores/modal.store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const modalStore = useModalStore()
const router = useRouter()
const { handleError } = useErrorService()

const showAccountCreate = ref(false)
const showCredits = ref(false)
const percentage = ref(0)

function handleUpdateProgressBar(value: number) {
  percentage.value = value
}

function handleCloseModal() {
  showCredits.value = false
}

function handleShowCreateAccount() {
  showAccountCreate.value = true
  appStore.setFullscreen()
}

function handleHideCreateAccount() {
  showAccountCreate.value = false
  handleUpdateProgressBar(0)
}

function handleShowLogin() {
  appStore.setFullscreen()
  modalStore.openModal(MODAL_NAMES.firstSession)
}

async function handleLoginUser(payload: { email: string, password: string }) {
  try {
    const data = await supabase.signIn(payload.email, payload.password)

    if (!data) {
      throw new Error('authSignInFailed')
    }

    modalStore.closeModal()
    router.push({ name: 'Dashboard' })
  } catch (error) {
    console.error(error)
    handleError({ showToast: true, msg: 'authSignInFailed' })
  }
}

function handleShowCredits() {
  showCredits.value = true
  modalStore.openModal(MODAL_NAMES.firstSession)
}
</script>

<template>
  <PageContainer
    class="flex items-center justify-center w-full text-center u-bg-app"
    padding="none"
    :show-footer="false"
  >
    <div
      v-if="showAccountCreate"
      class="h-full"
    >
      <div class="absolute w-full left-0 top-4 flex items-center gap-4 px-4">
        <Button
          icon-only
          :has-shadow="false"
          border-stroke-width="1"
          background-color="transparent"
          border-color="secondary-light"
          class="anim-scale-in-timed"
          @click="handleHideCreateAccount"
        >
          <Icon
            name="cornerDownLeft"
            size="sm"
            stroke-width="4"
          />
        </Button>

        <ProgressBar
          :percentage="percentage"
          class="w-full h-4 rounded-full bg-secondary appearance-none"
        />
      </div>

      <AppFirstSessionSteps @change="handleUpdateProgressBar" />
    </div>

    <div
      v-else
      class="flex items-center justify-center flex-col gap-20 h-full"
    >
      <img
        id="logo"
        src="/images/shared/logo.svg"
        alt="logo"
        class="max-w-80 mx-auto"
        width="260"
        height="177"
      >

      <div class="flex flex-col gap-6 text-center p-10">
        <Button
          background-color="tertiary"
          border-color="tertiary-light"
          size="xl"
          @click="handleShowCreateAccount"
        >
          {{ $t('createAnAccount') }}
        </Button>

        <Button
          size="sm"
          class="self-center px-4 py-3"
          @click="handleShowLogin"
        >
          {{ $t('haveAccount') }}
        </Button>

        <div class="absolute bottom-4 self-center">
          <Button
            border-color="secondary-light"
            background-color="secondary-dark"
            :has-shadow="false"
            size="xs"
            class="min-w-20"
            @click="handleShowCredits"
          >
            {{ $t('credits') }}
          </Button>
        </div>
      </div>
    </div>

    <Modal
      :name="MODAL_NAMES.firstSession"
      @close="handleCloseModal"
    >
      <ModalCredits v-if="showCredits" />

      <ModalLogin
        v-else
        @login="handleLoginUser"
      />
    </Modal>
  </PageContainer>
</template>
