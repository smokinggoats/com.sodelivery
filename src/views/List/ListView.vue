<template>
  <div
    class="list_view"
    :class="{ 'list_view--loading': loadingDeliveryPlaces }"
  >
    <Loading
      size="large"
      :loading="loadingDeliveryPlaces"
      v-if="loadingDeliveryPlaces"
    />
    <Card
      v-else
      v-for="deliveryPlace in deliveryPlaces"
      :key="deliveryPlace.id"
      :deliveryPlace="deliveryPlace"
    />
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/DeliveryPlaceCard/DeliveryPlaceCard.vue'
import Loading from '@/components/Loading/LoadingCircle.vue'
import type { DirectusInstance } from '@/plugins/directus'
import { DeliveryPlaceRepository } from '@/plugins/directus/repositories/DeliveryPlace'
import type { DeliveryPlace } from '@/plugins/directus/repositories/DeliveryPlace.types'
import { inject, ref } from 'vue'

const directus = inject<DirectusInstance>('directus')

const loadingDeliveryPlaces = ref(false)
const deliveryPlaces = ref([] as DeliveryPlace[])
const deliveryPlaceRepository = DeliveryPlaceRepository(directus)
try {
  loadingDeliveryPlaces.value = true
  const result = await deliveryPlaceRepository.getDeliveryPlaces()
  deliveryPlaces.value = result
} catch (error) {
  console.error({ error })
} finally {
  loadingDeliveryPlaces.value = false
}
</script>

<style lang="scss">
.list_view {
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
  .list_view {
    grid-template-columns: repeat(2, 50%);
    &--loading {
      grid-template-columns: repeat(1, 100%);
    }
  }
}
@media (min-width: 120em) {
  .list_view {
    grid-template-columns: repeat(4, 25%);
    &--loading {
      grid-template-columns: repeat(1, 100%);
    }
  }
}
</style>
