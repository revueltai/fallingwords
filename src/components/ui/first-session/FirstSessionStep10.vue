<script setup lang="ts">
import FirstSessionDotGift from '@/components/ui/first-session/FirstSessionDotGift.vue'
import { USER_ACCOUNT_DEFAULTS } from '@/configs/constants'
</script>

<template>
  <FirstSessionDotGift
    :amount="USER_ACCOUNT_DEFAULTS.gems"
    :heading="$t('starterGems')"
    icon-name="gem"
    item-name="Gems"
    text-color="primary-light"
  />
</template>
