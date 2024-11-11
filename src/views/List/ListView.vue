<template>
  <div class="list_view">
    <Card
      v-for="deliveryPlace in deliveryPlaces"
      :deliveryPlace="deliveryPlace"
    />
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/DeliveryPlaceCard/DeliveryPlaceCard.vue'
import type { DirectusInstance } from '@/plugins/directus'
import { DeliveryPlaceRepository } from '@/plugins/directus/repositories/DeliveryPlace'
import type { DeliveryPlace } from '@/plugins/directus/repositories/DeliveryPlace.types'
import { inject, ref } from 'vue'

const directus = inject<DirectusInstance>('directus')

const deliveryPlaces = ref([] as DeliveryPlace[])
const deliveryPlaceRepository = DeliveryPlaceRepository(directus)
deliveryPlaces.value = await deliveryPlaceRepository.getDeliveryPlaces()
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
}
@media (min-width: 40em) {
  .list_view {
    grid-template-columns: repeat(2, 50%);
  }
}
@media (min-width: 120em) {
  .list_view {
    grid-template-columns: repeat(4, 25%);
  }
}
</style>
