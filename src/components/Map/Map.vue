<template>
  <div id="map" class="map">
    <button id="map_button" class="map__button" @click="handleGetLocation">
      <font-awesome-icon icon="fa-solid fa-location-crosshairs" />
    </button>
  </div>
</template>

<script setup lang="ts">
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { onMounted, ref } from 'vue'

const initialMap = ref<L.Map>()
const locationMarker = ref<L.Marker>()

class Ctrl extends L.Control {
  public id: string
  constructor(id: string, options: L.ControlOptions) {
    super(options)
    this.id = id
  }
  onAdd(map: L.Map): HTMLElement {
    return document.querySelector(`#${this.id}`) as HTMLElement
  }
}

onMounted(() => {
  const initialCenter = [-23.5335, -46.0] as L.LatLngExpression
  const ctrl = new Ctrl('map_button', { position: 'topleft' })
  initialMap.value = L.map('map', {
    center: initialCenter,
    maxZoom: 17,
  })
    .setView(initialCenter, 10)
    .addControl(ctrl)
  locationMarker.value = L.marker(initialCenter).addTo(initialMap.value)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(initialMap.value)
})
async function handleGetLocation() {
  navigator.geolocation.getCurrentPosition(
    p => {
      const { latitude, longitude } = p.coords
      initialMap.value?.setView([latitude, longitude])
      locationMarker.value?.setLatLng([latitude, longitude])
    },
    err => {
      alert(err)
    },
    { enableHighAccuracy: true, timeout: 4000 },
  )
}
</script>

<style lang="scss">
.map {
  z-index: 0;
  width: 100%;
  height: 100%;
  &__button {
    z-index: 1;
    height: 2rem;
    width: 2rem;
    background-color: white;
    border-width: 0.1rem;
    box-shadow:
      0 0.5rem 1rem rgba(0, 0, 0, 0.24),
      0 6px 6px rgba(0, 0, 0, 0.46);
    cursor: pointer;
    transition: ease-in-out 200ms;
    &:active {
      box-shadow:
        0 0.1rem 0.1rem rgba(0, 0, 0, 0.24),
        0 2px 2px rgba(0, 0, 0, 0.46);
    }
  }
}
</style>
