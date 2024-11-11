<template>
  <Card :title="guide.display_name">
    <template v-slot:content>
      <markdown :source="guide.description" />
      <ul>
        <li v-for="place in guide.places.slice(0, 5)">
          {{ place.display_name }}
        </li>
      </ul>
    </template>
    <template v-slot:action></template>
  </Card>
</template>

<script setup lang="ts">
import type { Guide } from '@/plugins/directus/repositories/Guides'
import Card from '@/components/Card/Card.vue'

const props = defineProps<{ guide: Guide }>()
</script>

<style lang="scss">
.card {
  &__content {
  }

  &__action {
  }
}
</style>
