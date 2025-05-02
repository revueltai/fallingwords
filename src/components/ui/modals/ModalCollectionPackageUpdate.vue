<script setup lang="ts">
import AppShopItem from '@/components/ui/AppShopItem.vue'
import { useSettingsStore } from '@/stores/settings.store'

const props = defineProps<{ collection: AppCollection }>()

const emit = defineEmits(['update'])

const settingsStore = useSettingsStore()

function isPackageDisabled(pkgName: string) {
  const currentPackageIndex = settingsStore.appCollectionPackagesOrder.indexOf(props.collection.collection_package_name || 'sm')
  const targetPackageIndex = settingsStore.appCollectionPackagesOrder.indexOf(pkgName)
  return targetPackageIndex <= currentPackageIndex
}

async function handleUpdateLimit(packageTypeName: string) {
  emit('update', {
    packageTypeName,
    collectionId: props.collection.id,
  })
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <template
      v-for="(item, index) in settingsStore.appCollectionPackages"
      :key="index"
    >
      <AppShopItem
        v-if="item.id !== 'sm'"
        :uid="item.id"
        :amount="item"
        asset=""
        :disabled="isPackageDisabled(item.id)"
        :value="item.price"
        @click="handleUpdateLimit"
      />
    </template>
  </div>
</template>
