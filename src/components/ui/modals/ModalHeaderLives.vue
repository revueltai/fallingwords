<script setup lang="ts">
import NextLifeIndicator from '@/components/shared/NextLifeIndicator.vue'
import ShopBanner from '@/components/ui/ShopBanner.vue'
import { LIFE_MAX_REFILL_LIVES } from '@/configs/constants'
import { useModalStore } from '@/stores/modal.store'
import { useUserStore } from '@/stores/user.store'
import { computed, onMounted } from 'vue'

const userStore = useUserStore()
const modalStore = useModalStore()

const hasLivesOverDefault = computed(() => userStore.lives > LIFE_MAX_REFILL_LIVES)
const hasLivesEqualOrOverDefault = computed(() => userStore.lives >= LIFE_MAX_REFILL_LIVES)
const hasLivesUnderDefault = computed(() => userStore.lives < LIFE_MAX_REFILL_LIVES)

function handleCloseModal() {
  modalStore.closeModal()
}

onMounted(() => userStore.startLifeRegeneration())
</script>

<template>
  <div>
    <div>
      <p class="text-sm text-center">
        <template v-if="hasLivesEqualOrOverDefault">
          <i18n-t keypath="haveAllLivesPrompt" scope="global">
            <template #all>
              <span class="text-primary">{{ $t('all').toUpperCase() }}</span>
            </template>
          </i18n-t>
        </template>

        <template v-if="hasLivesUnderDefault">
          <i18n-t keypath="haveSomeLivesPrompt" scope="global">
            <template #lives>
              <span class="text-quaternary-light">{{ userStore.lives }}</span>
            </template>
          </i18n-t>
        </template>
      </p>

      <div class="flex gap-1 items-center bg-secondary-dark rounded-full px-4 py-2 my-4 justify-center">
        <Icon
          v-for="index in LIFE_MAX_REFILL_LIVES"
          :key="index"
          :name="`heart-${index <= userStore.lives ? 'full' : 'empty'}`"
          size="lg"
          type="fill"
        />
      </div>

      <p v-if="hasLivesOverDefault">
        {{ $t('and') }}

        <span class="bg-senary-dark rounded-full pl-2 pr-3 py-2 ml-1">
          <Icon
            name="heart-full"
            size="md"
            type="fill"
          />

          {{ userStore.lives - LIFE_MAX_REFILL_LIVES }} {{ $t('extraLives') }}
        </span>
      </p>
    </div>
  </div>

  <NextLifeIndicator />

  <ShopBanner @click="handleCloseModal" />
</template>
