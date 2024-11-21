export type Review = {
  id: string
  rating: number
}

export type SocialLink = {
  type: string
  href: string
}

export type DeliveryPlace = {
  id: string
  display_name: string
  name: string
  avgRating: number
  reviews: Review[]
  social_links: SocialLink[]
  place_point: GeoJSON.Point
}
