<script setup lang="ts">
import Map from '@/components/Map/MapDeliveryPlaces.vue'
</script>

<template>
  <div class="by_location_view">
    <h1>Por Perto</h1>
    &nbsp;
    <h2>
      <font-awesome-icon icon="fa-solid fa-person-digging" /> Em construção
    </h2>
    &nbsp;
    <Map ref="map"></Map>
  </div>
</template>

<style lang="scss">
.by_location_view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
