<script setup lang="ts">
interface Props {
  menuItems: DashboardMenu[]
  isLobby: boolean
  hasSelectedCollections: boolean
}

defineProps<Props>()

const emit = defineEmits([
  'showLobby',
  'startGame',
])
</script>

<template>
  <footer
    id="footer"
    class="absolute bottom-0 w-full flex items-center justify-center px-10 bg-gradient-to-b from-transparent to-secondary-dark"
  >
    <div class="max-w-96 bg-secondary border border-b-0 border-secondary-light w-full flex items-center justify-center rounded-t-3xl px-8 py-4 gap-4 shadow-md transition-all">
      <ul
        v-if="!isLobby"
        class="flex items-center justify-between gap-4"
      >
        <li
          v-for="item, index in menuItems"
          :key="index"
          class="text-center w-16"
        >
          <template v-if="item.id === 'play'">
            <Button
              icon-only
              background-color="tertiary"
              border-color="tertiary-light"
              size="xl"
              @click="emit('showLobby')"
            >
              <Icon
                :name="item.iconName"
                size="xl"
                type="fill"
              />
            </Button>
          </template>

          <Button
            v-else
            :to="item.url"
            is-link
            class="flex flex-col gap-1 items-center"
          >
            <Icon
              :name="item.iconName"
              size="lg"
              type="fill"
              color="white"
            />

            <span class="text-xs uppercase">
              {{ item.heading }}
            </span>
          </Button>
        </li>
      </ul>

      <Button
        v-else
        background-color="tertiary"
        border-color="tertiary-light"
        size="md"
        :disabled="!hasSelectedCollections"
        @click="emit('startGame')"
      >
        <template v-if="hasSelectedCollections">
          Start Game!
        </template>

        <template v-else>
          Select some Collections
        </template>
      </Button>
    </div>
  </footer>
</template>
