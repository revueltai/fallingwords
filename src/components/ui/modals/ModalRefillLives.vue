<script setup lang="ts">
import NextLifeIndicator from '@/components/shared/NextLifeIndicator.vue'
import ShopBanner from '@/components/ui/ShopBanner.vue'
import { LIFE_REFILL_TIME } from '@/configs/constants'
import { shopConfig } from '@/configs/shop.config'
import { useModalStore } from '@/stores/modal.store'
import { useUserStore } from '@/stores/user.store'
import { ToastService } from '@/services/ToastService'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()
const modalStore = useModalStore()

const livesRefillPackage = shopConfig.lives[0]

const refillTime = LIFE_REFILL_TIME / (60 * 1000)

const hasEnoughGems = computed(() => userStore.gems >= livesRefillPackage.price)

function handleCloseModal() {
  modalStore.closeModal()
}

function handleRefillLives() {
  if (livesRefillPackage) {
    userStore.increaseLives(livesRefillPackage.amount.lives)
    userStore.decreaseGems(livesRefillPackage.price)
    ToastService.emitToast(t('livesRefilled'), 'success')
  }

  handleCloseModal()
}
</script>

<template>
  <p class="text-center">
    {{ $t('livesRefill', { refillTime }) }}
  </p>

  <NextLifeIndicator />

  <template v-if="hasEnoughGems">
    <div class="flex flex-col gap-2 justify-center mt-8">
      <p class="text-md text-center">
        <i18n-t keypath="refillPrompt" scope="global">
          <strong class="text-primary" />
        </i18n-t>
      </p>

      <Button
        class="mt-3"
        size="sm"
        background-color="senary"
        border-color="senary-light"
        @click="handleRefillLives"
      >
        <div class="flex items-center gap-2">
          <Icon
            name="heart-full"
            size="lg"
            type="fill"
          />
          <span class="text-lg">
            {{ livesRefillPackage.amount.lives }}
          </span>
        </div>

        <span class="text-sm text-septenary-light mx-4">
          {{ $t('for') }}
        </span>

        <div class="flex items-center gap-2">
          <Icon
            name="gem"
            size="lg"
            type="fill"
          />

          <span class="text-lg">
            {{ livesRefillPackage.price }}
          </span>
        </div>
      </Button>
    </div>
  </template>

  <ShopBanner @click="handleCloseModal" />
</template>
