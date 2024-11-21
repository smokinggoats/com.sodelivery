<template>
  <BaseCard :title="deliveryPlace.display_name">
    <template v-slot:content>
      <div class="card__content__rating">
        Rating: {{ getRating(deliveryPlace.avgRating) }}
      </div>
      <div class="card__content__social_icons">
        <a
          v-for="si in deliveryPlace.social_links"
          :key="si.href"
          :href="si.href"
          target="_blank"
        >
          <font-awesome-icon :icon="getIconName(si.type)" />
        </a>
      </div>
    </template>
    <template v-slot:action>
      <button class="card__action__button">Detalhes</button>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '@/components/BaseCard/BaseCard.vue'
import type { DeliveryPlace } from '@/plugins/directus/repositories/DeliveryPlace.types'

defineProps<{ deliveryPlace: DeliveryPlace }>()
const getRating = (rating: number) => {
  if (rating > -1) {
    return rating.toFixed(2)
  }
  return 'N/A'
}
function getIconName(type: string) {
  switch (type) {
    case 'location_gmaps':
      return 'fa-solid fa-map'
    case 'site':
      return 'fa-solid fa-globe'
    case 'menu':
      return 'fa-solid fa-fork-knife'
    case 'whatsapp':
      return 'fa-brands fa-whatsapp'
    case 'phone':
      return 'fa-solid fa-phone'
    case 'instagram':
      return 'fa-brands fa-instagram'
    default:
      return ''
  }
}
</script>

<style lang="scss">
.card {
  &__content {
    &__rating {
      padding: 0.2rem 0;
      font-size: 0.8rem;
      font-weight: 600;
    }
    &__social_icons {
      display: flex;
      padding: 0.2rem 0;
      a {
        padding: 0.2rem;
        text-decoration: none;
        color: var(--color-accent);
        font-size: 1.6rem;
      }
    }
  }

  &__action {
    &__button {
      border: none;
      box-shadow: none;
      text-transform: uppercase;
      background-color: var(--card-button-background);
      color: var(--card-button-text);
      border-radius: 0.5rem;
      padding: 1rem;
      transition: ease-in-out 200ms;
      cursor: pointer;
      &:hover {
        color: var(--card-button-hover-text);
        background-color: var(--card-button-hover-background);
      }
      &:active {
        color: var(--card-button-active-text);
        background-color: var(--card-button-active-background);
      }
    }
  }
}
</style>
