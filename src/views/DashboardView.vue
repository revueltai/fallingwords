<script setup lang="ts">
import ModalRefillLives from '@/components/ui/modals/ModalRefillLives.vue'
import PageContainer from '@/components/ui/PageContainer.vue'
import PageContent from '@/components/ui/PageContent.vue'

import Streak from '@/components/ui/Streak.vue'
import { MODAL_NAMES } from '@/configs/constants'
import { useAppStore } from '@/stores/app.store'
import { useModalStore } from '@/stores/modal.store'
import { useUserStore } from '@/stores/user.store'
import { renderPluralWord } from '@/utils/'
import { onMounted } from 'vue'

const userStore = useUserStore()
const modalStore = useModalStore()
const appStore = useAppStore()

function handleShowRefillLivesModal() {
  if (!userStore.hasLives) {
    modalStore.openModal(MODAL_NAMES.noLives)
  }
}

onMounted(() => handleShowRefillLivesModal())
</script>

<template>
  <PageContainer>
    <div class="pb-8 mt-5 border-b border-b-secondary-light">
      <Streak />
    </div>

    <PageContent
      :is-empty="false"
      :has-footer="false"
      columns="1"
    >
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col border border-b-4 bg-secondary-light border-senary-light p-4 rounded-2xl">
          <div>
            <p class="text-sm mb-2">
              {{ $t('youHaveCreated') }}
            </p>

            <p class="text-xl text-quinary-light">
              {{ appStore.collectionsCount }} {{ renderPluralWord('Collection', appStore.collectionsCount) }}
            </p>
          </div>

          <Button
            :to="{ name: 'Collections' }"
            class="mt-8 self-start"
            size="sm"
            background-color="secondary-dark"
            border-color="secondary-light"
            has-icon
          >
            {{ $t('addMore') }}

            <Icon
              name="chevronRight"
              stroke-width="4"
              size="xs"
            />
          </Button>
        </div>

        <div class="flex flex-col border border-b-4 bg-secondary-light border-senary-light p-4 rounded-2xl">
          <div>
            <p class="text-sm mb-2">
              {{ $t('youHaveCreated') }}
            </p>

            <p class="text-xl text-tertiary-light">
              {{ appStore.collectionsWordsCount }} {{ renderPluralWord('Word', appStore.collectionsWordsCount) }}
            </p>
          </div>

          <Button
            :to="{ name: 'Collections' }"
            class="mt-8 self-start"
            size="sm"
            background-color="secondary-dark"
            border-color="secondary-light"
            has-icon
          >
            {{ $t('addMore') }}

            <Icon
              name="chevronRight"
              stroke-width="4"
              size="xs"
            />
          </Button>
        </div>

        <div class="col-span-2 flex border border-b-4 bg-secondary border-secondary-light rounded-2xl gap-0">
          <img src="/images/dashboard/DashboardPlay.svg">

          <div class="p-4 pb-6 -ml-[20%] sm:-ml-[10%] z-10">
            <p class="text-md mb-2 sm:text-lg">
              <i18n-t keypath="trainPrompt" scope="global">
                <template #time>
                  <span class="text-tertiary-light">{{ $t('threeMinutes') }}</span>
                </template>
              </i18n-t>
            </p>

            <Button
              :to="{ name: 'GameLobby' }"
              class="self-start mt-2"
              background-color="tertiary"
              border-color="tertiary-light"
              size="md"
              has-icon
            >
              <Icon
                name="game"
                type="fill"
                size="md"
              />

              {{ $t('letsPlay') }}
            </Button>
          </div>
        </div>
      </div>
    </PageContent>

    <Modal
      :heading="$t('notEnoughLives')"
      :name="MODAL_NAMES.noLives"
    >
      <ModalRefillLives />
    </Modal>
  </PageContainer>
</template>
