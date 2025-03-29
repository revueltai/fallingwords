<script setup lang="ts">
import ModalLogin from '@/components/ui/modals/ModalLogin.vue'
import { useModalStore } from '@/stores/modal.store'
import { useUserStore } from '@/stores/user.store'
import { ref } from 'vue'

const userStore = useUserStore()
const modalStore = useModalStore()
const showAccountCreate = ref(false)

function handleShowCreateAccount() {
  showAccountCreate.value = true
}

function handleShowLogin() {
  modalStore.openModal()
}

function handleLoginUser() {
  // login
}
</script>

<template>
  <section class="absolute flex items-center justify-center w-full h-full text-center u-bg-app">
    <div class="p-8 w-full h-full bg-gradient-to-b from-transparent to-secondary-light from-50% to-[200%]">
      <div v-if="showAccountCreate">
        aaa
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
