<template>
  <div class="search_view">
    <div class="search_input">
      <input
        id="search"
        class="search_input__input"
        :class="{
          'search_input__input--has-value': searchInput.length > 0,
        }"
        @input="search"
        :value="searchInput"
      />
      <label for="search" class="search_input__label">Busca</label>
    </div>
    <div class="search_result" :class="{ 'search_result--loading': searching }">
      <Loading v-if="searching" :loading="searching" size="large" />
      <DeliveryPlaceCard
        v-else
        v-for="deliveryPlace in deliveryPlaces"
        :delivery-place="deliveryPlace"
      ></DeliveryPlaceCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import Loading from '@/components/Loading/Loading.vue'
import DeliveryPlaceCard from '@/components/DeliveryPlaceCard/DeliveryPlaceCard.vue'
import type { DirectusInstance } from '@/plugins/directus'
import { DeliveryPlaceRepository } from '@/plugins/directus/repositories/DeliveryPlace'
import type { DeliveryPlace } from '@/plugins/directus/repositories/DeliveryPlace.types'
import { inject, ref } from 'vue'

const directus = inject<DirectusInstance>('directus')

const searchInput = ref('')
const searching = ref(false)
const deliveryPlaces = ref([] as DeliveryPlace[])
const deliveryPlaceRepository = DeliveryPlaceRepository(directus)
async function search(event: Event) {
  //@ts-expect-error
  const input = event?.target.value
  const shouldSearch = input && searchInput.value !== input && !searching.value

  if (shouldSearch) {
    searching.value = true
    try {
      deliveryPlaces.value =
        await deliveryPlaceRepository.searchDeliveryPlace(input)
    } finally {
      searching.value = false
    }
  } else if (input === '') {
    deliveryPlaces.value = []
  }

  searchInput.value = input
}
</script>

<style lang="scss">
.search_view {
  width: 100%;
  max-width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.search_input {
  display: flex;
  flex-direction: column;
  width: 75%;
  align-self: center;
  position: relative;
  &__input {
    width: 100%;
    font-size: 2rem;
    margin: 0.8rem 0;
    border-radius: 10rem;
    padding: 0.4rem 1.6rem;
  }
  &__label {
    font-size: 1.2rem;
    font-weight: 400;
    position: absolute;
    color: black;
    top: 50%;
    transform: translateY(-50%);
    left: 1.6rem;
    transition: all ease-in-out 150ms;
  }
  &__input:active + &__label,
  &__input:focus + &__label,
  &__input--has-value + &__label {
    font-size: 1rem;
    top: -1rem;
    font-weight: 500;
    color: white;
    transform: translateY(0%);
    left: 1.8rem;
  }
}
.search_result {
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
    justify-items: center;
  }
}
@media (min-width: 40em) {
  .search_result {
    grid-template-columns: repeat(2, 50%);
    &--loading {
      grid-template-columns: repeat(1, 100%);
    }
  }
  .search_input {
    width: 50%;
  }
}
@media (min-width: 120em) {
  .search_result {
    grid-template-columns: repeat(4, 25%);
    &--loading {
      grid-template-columns: repeat(1, 100%);
    }
  }

  .search_input {
    width: 20%;
  }
}
</style>
