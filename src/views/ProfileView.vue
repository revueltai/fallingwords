<script lang="ts" setup>
import ModalConfirm from '@/components/ui/modals/ModalConfirm.vue'
import ModalSettings from '@/components/ui/modals/ModalSettings.vue'
import PageContainer from '@/components/ui/PageContainer.vue'
import PageContent from '@/components/ui/PageContent.vue'
import ProfileItem from '@/components/ui/ProfileItem.vue'
import ProfileStatItem from '@/components/ui/ProfileStatItem.vue'
import { MODAL_NAMES } from '@/configs/constants'
import { useAppStore } from '@/stores/app.store'
import { useModalStore } from '@/stores/modal.store'
import { useStreakStore } from '@/stores/streak.store'
import { useUserStore } from '@/stores/user.store'
import { formatDate } from '@/utils'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

interface ModalConfig {
  name: string
  heading: string
  byline?: string
}

const router = useRouter()

const { t } = useI18n()
const userStore = useUserStore()
const appStore = useAppStore()
const modalStore = useModalStore()
const streakStore = useStreakStore()

const ModalComponentMap = {
  settings: ModalSettings,
  deleteAccount: ModalConfirm,
}

const activeModal = ref<ModalConfig | null>(null)

const createdAtDate = computed(() => {
  const date = formatDate(userStore.createdAt!)
  return `${date.day} ${t(date.month)} ${date.year}`
})

const modalComponent = computed(() => {
  return activeModal.value
    ? (ModalComponentMap as any)[activeModal.value.name]
    : null
})

function handleShowAvatarEditor() {
  // TODO: implement
}

function handleShowModalSettings() {
  activeModal.value = {
    name: MODAL_NAMES.settings,
    heading: 'settings',
  }

  modalStore.openModal(MODAL_NAMES.settings)
}

function handleShowModalDeleteAccount() {
  activeModal.value = {
    name: MODAL_NAMES.deleteAccount,
    heading: 'deleteAccount',
    byline: 'deleteAccountConfirm',
  }

  modalStore.openModal(MODAL_NAMES.deleteAccount)
}

function handleLogout() {
  userStore.logout()
  router.push({ name: 'Welcome' })
}

function handleDeleteAccount() {
  userStore.deleteAccount()
  router.push({ name: 'Welcome' })
}
</script>

<template>
  <PageContainer>
    <PageContent
      :is-empty="false"
      columns="1"
    >
      <div class="flex flex-col gap-4 items-center justify-center py-4 sm:py-8">
        <Button
          :has-shadow="false"
          border-color="secondary-light"
          background-color="secondary"
          icon-only
          class="w-20 h-20 sm:w-28 sm:h-28"
          @click="handleShowAvatarEditor"
        >
          <Icon
            name="user"
            size="2xl"
            type="fill"
            color="senary-light"
          />
        </Button>

        <TextBlock
          :heading="userStore.username"
          :subheading="userStore.email"
        />
      </div>

      <div class="flex justify-between gap-2">
        <div class="flex">
          <ProfileItem text="memberSince">
            {{ createdAtDate }}
          </ProfileItem>

          <ProfileItem
            text="speaks"
            class="border-l border-r border-secondary-light mx-4 px-4 sm:mx-6 sm:px-6"
          >
            <Flag
              v-for="(localeCode, index) in appStore.originalLocales"
              :key="`lo${index}`"
              :country-code="localeCode"
              size="sm"
            />
          </ProfileItem>

          <ProfileItem text="learning">
            <Flag
              v-for="(localeCode, index) in appStore.learningLocales"
              :key="`ll${index}`"
              :country-code="localeCode"
              size="sm"
            />
          </ProfileItem>
        </div>

        <Button
          is-unstyled
          icon-only
          @click="handleShowModalSettings"
        >
          <Icon
            name="gear"
            type="fill"
            size="lg"
          />
        </Button>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <ProfileStatItem
          icon-name="streakFlat"
          text="profileStreakDays"
          :amount="streakStore.currentStreak"
        />

        <ProfileStatItem
          icon-name="gemFlat"
          text="profileTotalGems"
          :amount="userStore.gems"
        />

        <ProfileStatItem
          icon-name="collection"
          text="profileCreatedCollections"
          :amount="appStore.collectionsCount"
        />

        <ProfileStatItem
          icon-name="wordFlat"
          text="profileCreatedWords"
          :amount="appStore.collectionsWordsCount"
        />
      </div>

      <template #footer>
        <div class="flex flex-col w-full gap-4">
          <Button
            background-color="secondary-dark"
            border-color="secondary"
            class="w-full"
            :has-shadow="true"
            size="md"
            @click="handleLogout"
          >
            {{ $t('logout') }}
          </Button>

          <Button
            background-color="secondary-dark"
            border-color="quaternary-dark"
            class="w-full"
            :has-shadow="true"
            size="md"
            @click="handleShowModalDeleteAccount"
          >
            {{ $t('deleteAccount') }}
          </Button>
        </div>
      </template>
      <!-- avatar:
      no img upload... generate avatar with custom faces and expressions from predefined options (head color, head deco, eyes expression/deco, mouth expression/deco).

      - streak count
      - total gems current
      - total lives current

      New things:
      1- awards > each gives u 10gems

      2- words vault:
      - Have a max number of collections (10) and words (30 per collection) that can be created.
      add an option in the shop to expand the vault size to add more collections (package of 5, 10, 15 collections)

      - have a shop package to enlarge the max size of collections (1 time purchase). enlarge:
      - from 30words per collection to 50, 70, 100

      Settings
      - sound
      - set amount of rounds per game
      - account > delete account
      - logout -->
    </PageContent>

    <Modal
      :name="activeModal ? activeModal.name : ''"
      :heading="activeModal ? $t(activeModal.heading) : ''"
    >
      <Component
        :is="modalComponent"
        :byline="activeModal && activeModal.byline ? $t(activeModal.byline) : ''"
        :cta-text="$t('delete')"
        icon-name="trashbin"
        event-name="delete"
        @delete="handleDeleteAccount"
      />
    </Modal>
  </PageContainer>
</template>
