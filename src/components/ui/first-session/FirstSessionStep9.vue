<script setup lang="ts">
import { useErrorService } from '@/composables/useErrorService'
import { Bus } from '@/services/EventBusService'
import { useUserStore } from '@/stores/user.store'
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
  stepId: string
  userOriginalLocale: AppLocaleCode
  userLearnLocale: AppLocaleCode
}

const props = defineProps<Props>()

const { handleError } = useErrorService()
const userStore = useUserStore()

const isPasswordVisible = ref(false)
const name = ref('ignacio')
const email = ref('revuelta.ig@gmail.com')
const age = ref('39')
const username = ref('iamnacho')
const password = ref('')

const formErrors = ref({
  name: '',
  email: '',
  age: '',
  username: '',
  password: '',
})

async function validateForm(): Promise<boolean> {
  if (!(name.value && email.value && age.value && username.value && password.value)) {
    return handleError({ showToast: true, msg: 'authMissingFields' })
  }

  if (!isValidPassword(password.value)) {
    return handleError({ showToast: true, msg: 'authPasswordWeak' })
  }

  const emailExists = await userStore.checkEmailExists(email.value)
  if (emailExists) {
    return handleError({ showToast: true, msg: 'authEmailExists' })
  }

  const usernameExists = await userStore.checkUsernameExists(username.value)
  if (usernameExists) {
    return handleError({ showToast: true, msg: 'authUsernameExists' })
  }

  return true
}

function isValidPassword(value: string) {
  const hasLower = /[a-z]/.test(value)
  const hasUpper = /[A-Z]/.test(value)
  const hasNumber = /\d/.test(value)
  const hasSymbol = /[!@#$%]/.test(value)
  const hasMinLength = value.length >= 8

  return hasLower && hasUpper && hasNumber && hasSymbol && hasMinLength
}

async function handleValidate(event: Event) {
  event.preventDefault()

  const formIsValid = await validateForm()

  if (!formIsValid) {
    Bus.emit('firstSessionDisableCta')
    return
  }

  Bus.emit('firstSessionEnableCta')
}

async function handleStoreData() {
  if (props.stepId !== 'createAccountPrompt') {
    return
  }

  const rs = await userStore.createUserAccount({
    name: name.value,
    age: age.value,
    email: email.value,
    username: username.value,
    password: password.value,
    originalLocale: props.userOriginalLocale,
    learnLocale: props.userLearnLocale,
  })

  if (rs) {
    Bus.emit('firstSessionGotoNextStep')
  }
}

function handleGeneratePassword() {
  const chars = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%',
  }

  const charsLength = Object.keys(chars).length

  password.value = Array.from({ length: 8 })
    .fill('')
    .map((_, i) => {
      const category = i < charsLength
        ? Object.values(chars)[i]
        : Object.values(chars)[Math.floor(Math.random() * charsLength)]

      return category[Math.floor(Math.random() * category.length)]
    })
    .sort(() => Math.random() - 0.5)
    .join('')

  handleValidate(new Event('input'))
}

function handlePasswordVisibilityToggle() {
  isPasswordVisible.value = !isPasswordVisible.value
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
        :label="$t('whatsYourName')"
        :placeholder="$t('enterAName')"
        required
        :error="formErrors.name"
        @input="handleValidate"
      />

      <Input
        v-model="email"
        name="email"
        type="email"
        :label="$t('emailLabel')"
        :placeholder="$t('emailPlaceholder')"
        required
        :error="formErrors.email"
        @input="handleValidate"
      />

      <Input
        v-model="age"
        name="age"
        type="number"
        :label="$t('ageLabel')"
        :placeholder="$t('agePlaceholder')"
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
          :label="$t('usernameLabel')"
          :placeholder="$t('usernamePlaceholder')"
          required
          :error="formErrors.username"
          @input="handleValidate"
        />

        <div class="flex flex-col gap-3 items-end">
          <Input
            v-model="password"
            name="password"
            label-color="primary"
            :type="isPasswordVisible ? 'text' : 'password'"
            :icon-name="isPasswordVisible ? 'eye-closed' : 'eye'"
            :label="`${$t('passwordLabel')} ${$t('passwordInfo')}`"
            :placeholder="$t('passwordPlaceholder')"
            :error="formErrors.password"
            required
            class="w-full"
            has-clickable-icon
            @input="handleValidate"
            @click-icon="handlePasswordVisibilityToggle"
          />

          <Button
            border-color="secondary-light"
            background-color="secondary-dark"
            :has-shadow="false"
            size="xs"
            class="min-w-20 mt-4 text-right"
            @click="handleGeneratePassword"
          >
            {{ $t('generatePassword') }}
          </Button>
        </div>
      </div>
    </div>
  </form>
</template>
