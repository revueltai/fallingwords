<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  menuItems: DashboardMenuItem[]
  isLobby: boolean
  hasSelectedCollections: boolean
}

defineProps<Props>()

const emit = defineEmits([
  'showLobby',
  'showSettings',
  'startGame',
])

const router = useRouter()

function handleClick(item: DashboardMenuItem) {
  if (item.id === 'settings') {
    emit('showSettings')
    return
  }

  router.push(item.url)
}
</script>

<template>
  <footer
    id="footer"
    class="absolute bottom-0 w-full flex items-center justify-center px-10 bg-gradient-to-b from-transparent to-secondary-dark"
  >
    <div class="max-w-96 bg-secondary border border-b-0 border-secondary-light w-full flex items-center justify-center rounded-t-3xl px-8 py-4 gap-4 shadow-md transition-all">
      <ul
        v-if="!isLobby"
        class="flex items-center justify-between gap-1"
      >
        <li
          v-for="item, index in menuItems"
          :key="index"
          class="text-center"
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
            :has-background="false"
            class="flex flex-col gap-1 items-center"
            @click="() => handleClick(item)"
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
        class="min-w-48"
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
