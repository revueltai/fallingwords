<script setup lang="ts">
import AppFirstSessionSteps from '@/components/ui/AppFirstSessionSteps.vue'
import ModalCredits from '@/components/ui/modals/ModalCredits.vue'
import ModalLogin from '@/components/ui/modals/ModalLogin.vue'
import { useModalStore } from '@/stores/modal.store'
import { useUserStore } from '@/stores/user.store'
import { isMobile } from '@/utils'
import { ref } from 'vue'

const userStore = useUserStore()
const modalStore = useModalStore()

const showAccountCreate = ref(false)
const showCredits = ref(false)
const percentage = ref(0)

function handleUpdateProgressBar(value: number) {
  percentage.value = value
}

function handleCloseModal() {
  showCredits.value = false
}

function handleEnterFullscreen() {
  if (isMobile()) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error('Fullscreen request failed:', err)
    })
  }
}

function handleShowCreateAccount() {
  showAccountCreate.value = true
  handleEnterFullscreen()
}

function handleHideCreateAccount() {
  showAccountCreate.value = false
}

function handleShowLogin() {
  handleEnterFullscreen()
  modalStore.openModal()
}

function handleLoginUser() {
  // login
}

function handleShowCredits() {
  showCredits.value = true
  modalStore.openModal()
}
</script>

<template>
  <section class="flex items-center justify-center w-full h-full text-center u-bg-app">
    <div class="p-5 sm:p-8 w-full h-full bg-gradient-to-b from-transparent to-secondary-light from-50% to-[200%]">
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
            Create an account
          </Button>

          <Button
            size="sm"
            class="self-center px-4 py-3"
            @click="handleShowLogin"
          >
            I already have an account
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
              Credits
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Modal @close="handleCloseModal">
    <ModalCredits v-if="showCredits" />

    <ModalLogin
      v-else
      @create="handleLoginUser"
    />
  </Modal>
</template>
