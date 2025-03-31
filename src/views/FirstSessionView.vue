<script setup lang="ts">
import AppFirstSessionSteps from '@/components/ui/AppFirstSessionSteps.vue'
import ModalLogin from '@/components/ui/modals/ModalLogin.vue'
import { useModalStore } from '@/stores/modal.store'
import { useUserStore } from '@/stores/user.store'
import { ref } from 'vue'

const userStore = useUserStore()
const modalStore = useModalStore()
const showAccountCreate = ref(true)

function handleShowCreateAccount() {
  showAccountCreate.value = true
}

function handleHideCreateAccount() {
  showAccountCreate.value = false
}

function handleShowLogin() {
  modalStore.openModal()
}

function handleLoginUser() {
  // login
}
</script>

<template>
  <section class="flex items-center justify-center w-full h-full text-center u-bg-app">
    <div class="p-8 w-full h-full bg-gradient-to-b from-transparent to-secondary-light from-50% to-[200%]">
      <div
        v-if="showAccountCreate"
        class="h-full"
      >
        <Button
          icon-only
          :has-shadow="false"
          border-stroke-width="1"
          background-color="transparent"
          border-color="secondary-light"
          class="absolute left-4 top-4 anim-scale-in-timed"
          @click="handleHideCreateAccount"
        >
          <Icon
            name="cornerDownLeft"
            size="sm"
            stroke-width="4"
          />
        </Button>

        <AppFirstSessionSteps />
      </div>

      <div
        v-else
        class="flex items-center justify-center flex-col gap-20 h-full"
      >
        <img
          id="logo"
          src="/images/shared/logo.svg"
          alt="logo"
          class="w-80 mx-auto"
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
        </div>
      </div>
    </div>
  </section>

  <Modal>
    <ModalLogin @create="handleLoginUser" />
  </Modal>
</template>
