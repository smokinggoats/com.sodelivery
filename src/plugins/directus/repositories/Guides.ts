import type { DirectusInstance } from '@/plugins/directus'
import GetGuideGql from '@/plugins/directus/repositories/queries/getGuides.gql'

export type GuideGql = {
  name: string
  display_name: string
  description: string
  places: {
    delivery_place_id: {
      name: string
      display_name: string
    }
  }[]
}

export type Guide = {
  name: string
  display_name: string
  description: string
  places: {
    name: string
    display_name: string
  }[]
}

export function parseGuide(guide: GuideGql): Guide {
  const places = guide.places.map(el => el.delivery_place_id)
  return {
    ...guide,
    places,
  }
}

export function GuidesRepository(directus?: DirectusInstance) {
  if (!directus?.client) throw 'missing_directus_client'

  return {
    directus,
    async getGuides(): Promise<Guide[]> {
      const result = await this.directus.client.query<{
        guides: GuideGql[]
      }>(GetGuideGql.loc?.source.body || '')
      return (result.guides || []).map(parseGuide)
    },
  }
}
