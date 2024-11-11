import type { DirectusInstance } from '@/plugins/directus'
import type {
  DeliveryPlace,
  Review,
} from '@/plugins/directus/repositories/DeliveryPlace.types'
import GetDeliveryPlaceByIdGql from '@/plugins/directus/repositories/queries/getDeliveryPlaceById.gql'
import GetDeliveryPlacesGql from '@/plugins/directus/repositories/queries/getDeliveryPlaces.gql'
import SearchDeliveryPlacesGql from '@/plugins/directus/repositories/queries/searchDeliveryPlaces.gql'
import { safeDivide, sum } from '@/utils/math'

export function calculateReviewAverage<T extends number, K extends Review>(
  acc: T,
  r: K,
) {
  return sum(acc, r.rating)
}

export function parseDeliveryPlace(deliveryPlace: DeliveryPlace) {
  const reviews = deliveryPlace.reviews.length
  const avgRating =
    reviews > 0
      ? safeDivide(
          deliveryPlace.reviews.reduce(calculateReviewAverage, 0),
          deliveryPlace.reviews.length,
        )
      : -1
  return {
    ...deliveryPlace,
    avgRating,
  }
}

export function DeliveryPlaceRepository(directus?: DirectusInstance) {
  if (!directus?.client) throw 'missing_directus_client'

  return {
    directus,
    async getDeliveryPlaces(): Promise<DeliveryPlace[]> {
      const result = await this.directus.client.query<{
        delivery_place: DeliveryPlace[]
      }>(GetDeliveryPlacesGql.loc?.source.body || '')
      return (result.delivery_place || []).map(parseDeliveryPlace)
    },
    async getDeliveryPlace(id: DeliveryPlace['id']) {
      const result = await this.directus.client.query<{
        delivery_place: DeliveryPlace
      }>(GetDeliveryPlaceByIdGql.loc?.source.body || '', { id })
      if (!result?.delivery_place?.id) throw `delivery_place_not_found_${id}`
      return parseDeliveryPlace(result.delivery_place)
    },
    async searchDeliveryPlace(input: DeliveryPlace['name']) {
      const result = await this.directus.client.query<{
        delivery_places: DeliveryPlace[]
      }>(SearchDeliveryPlacesGql.loc?.source.body || '', { input })
      return (result.delivery_places || []).map(parseDeliveryPlace)
    },
  }
}
