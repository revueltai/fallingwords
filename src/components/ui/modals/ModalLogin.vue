<script setup lang="ts">
import { useErrorService } from '@/composables/useErrorService'
import { ref } from 'vue'

const emit = defineEmits(['login'])

const { handleError } = useErrorService()

const email = ref('')
const password = ref('')

const formErrors = ref({
  email: '',
  password: '',
})

async function validateForm(): Promise<boolean> {
  if (!(email.value && password.value)) {
    return handleError({ showToast: true, msg: 'authMissingFields' })
  }

  return true
}

async function handleSubmit(event: Event) {
  event.preventDefault()

  const formIsValid = await validateForm()

  if (formIsValid) {
    emit('login', {
      email: email.value,
      password: password.value,
    })
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-8 flex flex-col gap-4">
      <Input
        v-model="email"
        name="email"
        type="email"
        :label="$t('emailLabel')"
        :placeholder="$t('emailPlaceholderEnter')"
        required
        :error="formErrors.email"
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
