<template>
  <div class="guides_view">
    <Card v-for="guide in guides" :guide="guide" />
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/GuideCard/GuideCard.vue'
import type { DirectusInstance } from '@/plugins/directus'
import {
  GuidesRepository,
  type Guide,
} from '@/plugins/directus/repositories/Guides'
import { inject, ref } from 'vue'

const directus = inject<DirectusInstance>('directus')

const guides = ref([] as Guide[])
const guidesRepository = GuidesRepository(directus)
guides.value = await guidesRepository.getGuides()
</script>

<style lang="scss">
.guides_view {
  width: 100%;
  max-width: 100%;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(1, 100%);
  align-items: center;
  box-sizing: border-box;
  position: relative;
  grid-gap: 1rem;
}
@media (min-width: 40em) {
  .guides_view {
    grid-template-columns: repeat(2, 50%);
  }
}
@media (min-width: 120em) {
  .guides_view {
    grid-template-columns: repeat(4, 25%);
  }
}
</style>
