<template>
  <router-view />
</template>

<script lang="ts">
import { onMounted, defineComponent } from 'vue'
import { vAnimController } from 'vue-simple-transitions'

export default defineComponent({
  name: 'App',
  setup() {
    onMounted(() => {
      vAnimController()
    })
  }
})
</script>
