<script setup lang="ts">
import { useErrorService } from '@/composables/useErrorService'
import { APP_LOCALSTORAGE_KEYS } from '@/configs/constants'
import { Bus } from '@/services/EventBusService'
import { LocalStorageService } from '@/services/LocalStorageService'
import { useAppStore } from '@/stores/app.store'
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
const appStore = useAppStore()

const isPasswordVisible = ref(false)
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

async function validateUsername() {
  const usernameExists = await userStore.checkUsernameExists(username.value)
  if (usernameExists) {
    return handleError({ showToast: true, msg: 'authUsernameExists' })
  }

  return true
}

async function validateEmail() {
  const emailExists = await userStore.checkEmailExists(email.value)
  if (emailExists) {
    return handleError({ showToast: true, msg: 'authEmailExists' })
  }

  return true
}

function validatePassword() {
  if (!isValidPassword(password.value)) {
    return handleError({ showToast: true, msg: 'authPasswordWeak' })
  }

  return true
}

async function validateForm(): Promise<boolean> {
  if (!(name.value && email.value && age.value && username.value && password.value)) {
    return handleError({ showToast: true, msg: 'authMissingFields' })
  }

  if (!validatePassword()) {
    return false
  }

  if (!await validateEmail()) {
    return false
  }

  if (!await validateUsername()) {
    return false
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

async function createFirstWord(collectionId: string, storageData: any) {
  const rsFirstWordId = await appStore.createWord(collectionId, {
    original: storageData.word.original,
    learn: storageData.word.learn,
  })

  if (rsFirstWordId) {
    Bus.emit('firstSessionGotoNextStep')
  }
}

async function createFirstCollection(storageData: any) {
  return await appStore.createCollection({
    name: storageData.name,
    localeOriginal: storageData.localeOriginal,
    localeLearn: storageData.localeLearn,
  })
}

async function handleStoreData() {
  if (props.stepId !== 'createAccountPrompt') {
    return
  }

  const rsUserAccount = await userStore.createUserAccount({
    name: name.value,
    age: age.value,
    email: email.value,
    username: username.value,
    password: password.value,
    originalLocale: props.userOriginalLocale,
    learnLocale: props.userLearnLocale,
  })

  if (!rsUserAccount) {
    return
  }

  const storageData = LocalStorageService.loadStoreData(APP_LOCALSTORAGE_KEYS.userFirstSession)
  const collectionId = await createFirstCollection(storageData)

  if (collectionId) {
    await createFirstWord(collectionId, storageData)
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
  <form class="anim-scale-in-timed" @blur="handleValidate">
    <div class="mb-8 flex flex-col gap-4">
      <Input
        v-model="name"
        name="name"
        type="text"
        :label="$t('whatsYourName')"
        :placeholder="$t('enterAName')"
        required
        :error="formErrors.name"
      />

      <Input
        v-model="email"
        name="email"
        type="email"
        :label="$t('emailLabel')"
        :placeholder="$t('emailPlaceholder')"
        required
        :error="formErrors.email"
        @blur="validateEmail"
      />

      <Input
        v-model="age"
        name="age"
        type="number"
        :label="$t('ageLabel')"
        :placeholder="$t('agePlaceholder')"
        required
        :error="formErrors.age"
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
          @blur="validateUsername"
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
            @click-icon="handlePasswordVisibilityToggle"
            @blur="validatePassword"
          />

          <Button
            border-color="secondary-light"
            background-color="secondary-dark"
            :has-shadow="false"
            size="xs"
            class="min-w-20 text-right"
            @click="handleGeneratePassword"
          >
            {{ $t('generatePassword') }}
          </Button>
        </div>
      </div>
    </div>
  </form>
</template>
