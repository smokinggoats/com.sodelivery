<template>
  <BaseCard :title="guide.display_name">
    <template v-slot:content>
      <markdown-render :source="guide.description" />
      <ul>
        <li v-for="place in guide.places.slice(0, 5)" :key="place.name">
          {{ place.display_name }}
        </li>
      </ul>
    </template>
    <template v-slot:action></template>
  </BaseCard>
</template>

<script setup lang="ts">
import type { Guide } from '@/plugins/directus/repositories/Guides'
import BaseCard from '@/components/BaseCard/BaseCard.vue'

defineProps<{ guide: Guide }>()
</script>
