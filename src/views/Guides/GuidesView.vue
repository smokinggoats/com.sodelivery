<template>
  <div class="guides_view" :class="{ 'guides_view--loading': loadingGuides }">
    <Loading size="large" :loading="loadingGuides" v-if="loadingGuides" />
    <GuideCard
      v-else
      v-for="guide in guides"
      :guide="guide"
      :key="guide.name"
    />
  </div>
</template>

<script setup lang="ts">
import GuideCard from '@/components/GuideCard/GuideCard.vue'
import Loading from '@/components/Loading/LoadingCircle.vue'
import type { DirectusInstance } from '@/plugins/directus'
import {
  GuidesRepository,
  type Guide,
} from '@/plugins/directus/repositories/Guides'
import { inject, ref } from 'vue'

const directus = inject<DirectusInstance>('directus')

const guides = ref([] as Guide[])
const guidesRepository = GuidesRepository(directus)

const loadingGuides = ref(false)
try {
  loadingGuides.value = true
  const result = (guides.value = await guidesRepository.getGuides())
  guides.value = result
} catch (error) {
  console.error({ error })
} finally {
  loadingGuides.value = false
}
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
  &--loading {
    justify-content: center;
    text-align: center;
    grid-template-columns: repeat(1, 100%);
    justify-items: center;
  }
}
@media (min-width: 40em) {
  .guides_view {
    grid-template-columns: repeat(2, 50%);
    &--loading {
      grid-template-columns: repeat(1, 100%);
    }
  }
}
@media (min-width: 120em) {
  .guides_view {
    grid-template-columns: repeat(4, 25%);
    &--loading {
      grid-template-columns: repeat(1, 100%);
    }
  }
}
</style>
