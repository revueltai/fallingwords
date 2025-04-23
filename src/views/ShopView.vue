<script lang="ts" setup>
import AppShopItem from '@/components/ui/AppShopItem.vue'
import AppShopItemSpecialOffers from '@/components/ui/AppShopItemSpecialOffers.vue'
import ModalShopConfirmPurchase from '@/components/ui/modals/ModalShopConfirmPurchase.vue'
import ModalShopMissingGems from '@/components/ui/modals/ModalShopMissingGems.vue'
import PageContainer from '@/components/ui/PageContainer.vue'
import PageContent from '@/components/ui/PageContent.vue'
import { MODAL_NAMES } from '@/configs/constants'
import { shopConfig } from '@/configs/shop.config'
import { ToastService } from '@/services/ToastService'
import { useModalStore } from '@/stores/modal.store'
import { useUserStore } from '@/stores/user.store'
import { getRandomNum } from '@/utils'
import { computed, ref, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()
const modalStore = useModalStore()

const modalComponent = shallowRef<any | null>(null)
const itemToPurchase = ref<ShopItem | null>(null)
const action = ref<'missingGems' | 'confirmPurchase' | null>(null)

const shopBlocks = computed(() => [
  {
    heading: 'More Lives',
    list: shopConfig.lives,
  },
  {
    heading: 'Boost Your Game',
    list: shopConfig.powerups,
  },
])

function findShopItemByUid(uid: string): ShopItem | null {
  for (const category of Object.values(shopConfig)) {
    const item = category.find(item => item.uid === uid)

    if (item) {
      return item
    }
  }

  return null
}

function handleShowModalPurchase(uid: string) {
  itemToPurchase.value = findShopItemByUid(uid)
  const missingGems = (itemToPurchase.value && itemToPurchase.value.price > userStore.gems)

  modalComponent.value = missingGems
    ? ModalShopMissingGems
    : ModalShopConfirmPurchase

  action.value = missingGems
    ? 'missingGems'
    : 'confirmPurchase'

  modalStore.openModal(MODAL_NAMES.shop)
}

function handlePurchase() {
  if (itemToPurchase.value) {
    Object.entries(itemToPurchase.value.amount).forEach((item) => {
      if (item[0] === 'lives') {
        userStore.increaseLives(item[1])
      } else {
        userStore.increasePowerups(item[0] as PowerupIngame, item[1])
      }
    })

    userStore.decreaseGems(itemToPurchase.value.price)
    modalStore.closeModal()
    ToastService.emitToast(t(`purchaseSign${getRandomNum(5)}`), 'success')
  }
}
</script>

<template>
  <PageContainer
    :heading="$t('dotsShop')"
    :subheading="$t('dotsShopSubheading')"
  >
    <PageContent
      :is-empty="false"
      :has-footer="false"
      columns="1"
    >
      <div>
        <p class="text-senary-light text-md mb-2">
          {{ $t('specialOffers') }}
        </p>

        <div class="grid grid-cols-1 gap-4">
          <AppShopItemSpecialOffers
            v-for="item in shopConfig.specialOffers"
            :key="item.uid"
            columns="3"
            :uid="item.uid"
            :heading="item.heading"
            :description="item.description"
            :amount="item.amount"
            :asset="item.asset"
            :value="item.price"
            @click="handleShowModalPurchase"
          />
        </div>
      </div>

      <div
        v-for="(shopBlock, index) in shopBlocks"
        :key="index"
      >
        <p class="text-primary text-md mb-2">
          {{ shopBlock.heading }}
        </p>

        <div class="grid grid-cols-3 gap-4">
          <AppShopItem
            v-for="item in shopBlock.list"
            :key="item.uid"
            :uid="item.uid"
            :amount="item.amount"
            :asset="item.asset"
            :value="item.price"
            @click="handleShowModalPurchase"
          />
        </div>
      </div>
    </PageContent>

    <Modal
      :name="MODAL_NAMES.shop"
      :header-asset="action === 'missingGems' ? '/images/shop/MissingGems.svg' : `/images/shop/${itemToPurchase?.asset}.svg`"
      :heading="$t(action === 'missingGems' ? 'notEnoughGems' : 'confirmPurchase')"
    >
      <Component
        :is="modalComponent"
        :item-to-purchase="itemToPurchase"
        @purchase="handlePurchase"
      />
    </Modal>
  </PageContainer>
</template>
