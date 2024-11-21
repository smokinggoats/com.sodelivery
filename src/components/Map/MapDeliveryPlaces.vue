<template>
  <div class="top-panel">
    <span>
      <input
        v-model="radius"
        type="range"
        @input="handleRenderMapBox"
        :disabled="loadingDeliveryPlaces"
        step="100"
        min="100"
        max="10000"
      />
      {{ radius }} m
    </span>
    <Loading :loading="loadingDeliveryPlaces || loadingLocation" />
  </div>
  <div id="map" class="map">
    <button id="map_button" class="map__button" @click="handleGetLocation">
      <font-awesome-icon icon="fa-solid fa-location-crosshairs" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { DirectusInstance } from '@/plugins/directus'
import { DeliveryPlaceRepository } from '@/plugins/directus/repositories/DeliveryPlace'
import type { DeliveryPlace } from '@/plugins/directus/repositories/DeliveryPlace.types'
import type { MapBoxInstance } from '@/plugins/map/box'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { inject, onMounted, ref } from 'vue'
import Loading from '../Loading/LoadingCircle.vue'

const directus = inject<DirectusInstance>('directus')
const mapBoxPlugin = inject<MapBoxInstance>('mapBox')
const deliveryPlaceRepository = DeliveryPlaceRepository(directus)

const map = ref<L.Map>()
const locationMarker = ref<L.Marker>()
const deliveryMarkers = ref<L.Marker[]>([])
const deliveryPlaces = ref([] as DeliveryPlace[])
const radius = ref(1)

class FindMeController extends L.Control {
  public id: string
  constructor(id: string, options: L.ControlOptions) {
    super(options)
    this.id = id
  }
  onAdd(): HTMLElement {
    return document.querySelector(`#${this.id}`) as HTMLElement
  }
}

function initializeMap({
  dragFn,
}: {
  dragFn: L.DragEndEventHandlerFn
}): [map: L.Map, centerMarker: L.Marker] {
  const initialCenter = [-23.5335, -46.0] as L.LatLngExpression
  const ctrl = new FindMeController('map_button', { position: 'topleft' })
  const titleLayer = L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 17,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  )
  const centerMarker = L.marker(initialCenter, {
    draggable: true,
    icon: L.divIcon({
      className: 'fa-solid fa-user map-icon',
    }),
  })
    .on('dragend', dragFn)
    .on('click', event => {
      const _map = event.target._map as L.Map
      const latLng = event.latlng
      _map.setView(latLng)
    })
  const map = L.map('map', {
    center: initialCenter,
    maxZoom: 17,
  })
  map
    .setView(initialCenter, 10)
    .addControl(ctrl)
    .addLayer(titleLayer)
    .addLayer(centerMarker)
  return [map, centerMarker]
}

function createDeliveryMarker(deliveryPlace: DeliveryPlace, map: L.Map) {
  const center = [
    deliveryPlace.place_point.coordinates[1],
    deliveryPlace.place_point.coordinates[0],
  ] as L.LatLngExpression
  const m = L.marker(center, {
    draggable: false,
    icon: L.divIcon({
      className: 'fa-solid fa-location-dot delivery-place-icon',
    }),
  })
    .bindTooltip(
      L.tooltip({
        content: deliveryPlace.display_name,
        direction: 'top',
        sticky: true,
      }),
    )
    .on('click', event => {
      const _map = event.target._map as L.Map
      const latLng = event.latlng
      _map.setView(latLng)
    })
    .addTo(map)
  return m
}

const loadingLocation = ref(false)
async function asyncGetLocation(
  _options = {},
): Promise<GeolocationCoordinates> {
  const options = { enableHighAccuracy: true, timeout: 4000, ..._options }
  try {
    loadingLocation.value = true
    const result = await new Promise<GeolocationCoordinates>((res, rej) =>
      navigator.geolocation.getCurrentPosition(
        p => res(p.coords),
        err => rej(err),
        options,
      ),
    )
    return result
  } finally {
    loadingLocation.value = false
  }
}

async function renderSearchArea(
  coordLatLng: L.LatLngExpression[],
  map: L.Map,
  _config: L.Polygon['options'] = {},
) {
  const attribution = 'search-area'
  const config = {
    color: 'red',
    fillColor: '#f00',
    fillOpacity: 0.3,
    ..._config,
  }
  const searchAreaPolygon = L.polygon(coordLatLng, {
    ...config,
    attribution,
  })
  map.eachLayer(
    lay =>
      lay.getAttribution &&
      lay.getAttribution() === attribution &&
      lay.removeFrom(map),
  )
  map.addLayer(searchAreaPolygon)
  return searchAreaPolygon
}

function deleteMarkers(markers: L.Marker[], map: L.Map) {
  return markers.map(m => m.removeFrom(map))
}

function renderMarkers(
  searchResult: DeliveryPlace[],
  map: L.Map,
  deliveryMarkers: L.Marker[] = [],
) {
  deleteMarkers(deliveryMarkers, map)
  return searchResult.map(d => createDeliveryMarker(d, map))
}

const loadingDeliveryPlaces = ref(false)
async function loadDeliveryPlaces(
  coordXY: number[][],
): Promise<DeliveryPlace[]> {
  if (loadingDeliveryPlaces.value) return []
  loadingDeliveryPlaces.value = true
  try {
    const searchResult = await deliveryPlaceRepository.geoSearchDeliveryPlaces({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [coordXY],
      },
    })
    return searchResult
  } finally {
    loadingDeliveryPlaces.value = false
  }
}

onMounted(() => {
  const [m, cm] = initializeMap({ dragFn: handleRenderMapBox })
  map.value = m
  locationMarker.value = cm
})

async function handleGetLocation() {
  const { latitude, longitude } = await asyncGetLocation()
  map.value?.setView([latitude, longitude])
  locationMarker.value?.setLatLng([latitude, longitude])
  handleRenderMapBox()
}

async function handleRenderMapBox() {
  if (locationMarker.value && map.value) {
    const { lat, lng } = locationMarker.value?.getLatLng()
    const box = mapBoxPlugin?.calculateBoundingBox(
      lat,
      lng,
      radius.value / 1000,
    )
    if (box) {
      const coordXY = [
        [box.lng.min, box.lat.min],
        [box.lng.max, box.lat.min],
        [box.lng.max, box.lat.max],
        [box.lng.min, box.lat.max],
        [box.lng.min, box.lat.min],
      ]
      const coordLatLng = coordXY.map(
        el => [...el].reverse() as L.LatLngExpression,
      )

      if (!loadingDeliveryPlaces.value) {
        const searchResult = await loadDeliveryPlaces(coordXY)
        const oldMarkers = [...deliveryMarkers.value] as L.Marker[]
        deliveryMarkers.value = renderMarkers(
          searchResult,
          map.value,
          oldMarkers,
        )
        renderSearchArea(coordLatLng, map.value)
        deliveryPlaces.value = searchResult
      }
    }
  }
}
</script>

<style lang="scss">
.top-panel {
  min-height: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.map-icon {
  height: 3.2rem !important;
  width: 3.2rem !important;
  z-index: 1000 !important;
  font-size: 2.4rem;
  &:before {
    margin-top: -1.2rem;
    margin-left: -1.2rem;
    text-align: center;
    width: 100%;
    height: 100%;
    color: #333;
    border: solid 2px #333;
    border-radius: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.4rem;
    opacity: 1 !important;
  }
}
.delivery-place-icon {
  height: 3.2rem !important;
  width: 3.2rem !important;
  font-size: 2.4rem;
  &:before {
    margin-top: -1.2rem;
    margin-left: -1.2rem;
    text-align: center;
    width: 100%;
    height: 100%;
    color: crimson;
    border: solid 2px crimson;
    border-radius: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.4rem;
    opacity: 1 !important;
  }
}
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
