<script setup lang="ts">
import { Bus } from '@/utils/EventBus'
import { onMounted, onUnmounted, ref } from 'vue'

const name = ref('')
const email = ref('')
const age = ref('')
const username = ref('')
const password = ref('')

const formErrors = ref({
  name: '',
  email: '',
  age: '',
  username: '',
  password: '',
})

function validateForm(): boolean {
  return !!(name.value && email.value && age.value && username.value && password.value)
}

async function handleValidate(event: Event) {
  event.preventDefault()

  if (validateForm()) {
    Bus.emit('firstSessionEnableCta')
  }
}

async function handleStoreData(data: { step: number }) {
  if (data.step !== 9) {
    return
  }

  const rs = await appStore.createWord(selectedCollection.value?.uid, {
    original: original.value,
    learn: learn.value,
  })

  if (rs) {
    Bus.emit('firstSessionGotoNextStep')
  }
}

onMounted(async () => Bus.on('firstSessionSaveStepData', handleStoreData))

onUnmounted(() => Bus.off('firstSessionSaveStepData', handleStoreData))
</script>

<template>
  <form class="anim-scale-in-timed">
    <div class="mb-8 flex flex-col gap-4">
      <Input
        v-model="name"
        name="name"
        type="text"
        label="What’s your name?"
        placeholder="Enter a name"
        required
        :error="formErrors.name"
        @input="handleValidate"
      />

      <Input
        v-model="email"
        name="email"
        type="email"
        label="What’s your e-mail?"
        placeholder="Enter an e-mail"
        required
        :error="formErrors.email"
        @input="handleValidate"
      />

      <Input
        v-model="age"
        name="age"
        type="age"
        label="What’s your age?"
        placeholder="Enter your age"
        required
        :error="formErrors.email"
        @input="handleValidate"
      />

      <div class="mb-8 flex flex-col gap-4 border-t border-primary-light pt-6 mt-4">
        <Input
          v-model="username"
          name="username"
          type="text"
          label-color="primary"
          label="How should we call you?"
          placeholder="Enter a username"
          required
          :error="formErrors.username"
          @input="handleValidate"
        />

        <Input
          v-model="password"
          name="password"
          type="password"
          label-color="primary"
          label="Set a Password"
          placeholder="Enter a password"
          required
          :error="formErrors.password"
          @input="handleValidate"
        />
      </div>
    </div>
  </form>
</template>
