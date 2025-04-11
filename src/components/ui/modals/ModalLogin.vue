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
        name="userName"
        type="text"
        :label="$t('usernameLabel')"
        :placeholder="$t('usernamePlaceholderEnter')"
        required
        :error="formErrors.userName"
      />
      <Input
        v-model="password"
        name="password"
        type="password"
        :label="$t('passwordLabel')"
        :placeholder="$t('passwordPlaceholderEnter')"
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
      {{ $t('login') }}
    </Button>
  </form>
</template>
