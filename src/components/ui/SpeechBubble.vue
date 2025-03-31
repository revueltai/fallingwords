<script setup lang="ts">
interface Props {
  textTop: string
  textBottom: string
}

defineProps<Props>()

function highlightColors(text: string): string {
  return text.replace(/\[(.*?)\]%([a-z-]+)%/gi, (match, content, colorName) => {
    return `<span class=\"text-${colorName}\">${content}</span>`
  })
}
</script>

<template>
  <div class="text-white bg-secondary-dark border border-secondary-light rounded-2xl px-4 py-2">
    <span v-html="highlightColors(textTop)" /><br>
    <span v-html="highlightColors(textBottom)" />
  </div>
</template>
