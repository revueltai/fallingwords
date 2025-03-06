<script setup lang="ts">
interface Props {
  uid: string
  name: string
  wordCount: number
  hasButtons?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hasButtons: true,
})

function handleViewCollection() {
  console.log('view', props.uid)
}

function handleEditCollection() {
  console.log('edit', props.uid)
}
</script>

<template>
  <div class="rounded-2xl p-4 border border-secondary hover:border-secondary-light">
    <div class="flex justify-between items-center gap-4 overflow-hidden">
      <div class="flex justify-between items-center gap-4">
        <img
          src="/images/dashboard/book1.svg"
          width="40"
          height="40"
          class="w-10 h-12"
        >

        <div class="truncate overflow-hidden">
          <h3 class="text-white text-p">
            {{ name }}
          </h3>
          <p class="text-primary text-xs">
            {{ wordCount }} words
          </p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <Button
          size="sm"
          @click="handleViewCollection"
        >
          Words
        </Button>

        <Button
          icon-only
          background-color="tertiary"
          border-color="tertiary-light"
          size="md"
          @click="handleEditCollection"
        >
          <Icon
            name="pencil"
            size="xs"
          />
        </Button>
      </div>
    </div>
  </div>
</template>
