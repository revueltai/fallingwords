<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['create'])

const userName = ref('')
const password = ref('')

const formErrors = ref({
  userName: '',
  password: '',
})

function validateForm(): boolean {
  return !!(userName.value && password.value)
}

function handleSubmit(event: Event) {
  event.preventDefault()

  if (validateForm()) {
    emit('create', {
      userName: userName.value,
      password: password.value,
    })
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-8 flex flex-col gap-4">
      <Input
        v-model="userName"
        name="userName  "
        type="text"
        label="User Name"
        placeholder="Enter your username"
        required
        :error="formErrors.userName"
      />
      <Input
        v-model="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        required
        :error="formErrors.password"
      />
    </div>

    <Button
      size="md"
      has-icon
      type="submit"
      class="w-full"
    >
      Login
    </Button>
  </form>
</template>
