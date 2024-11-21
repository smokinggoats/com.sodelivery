import {
  createDirectus,
  graphql,
  rest,
  type ClientOptions,
  type DirectusClient,
  type GraphqlClient,
  type RestClient,
} from '@directus/sdk'
import type { Plugin } from 'vue'

export type DirectusInstance<T = object> = {
  client: DirectusClient<T> & RestClient<T> & GraphqlClient<T>
}

export function DirectusFactory<Schema = object>(
  baseUrl: string,
  options?: ClientOptions,
): DirectusInstance<Schema> {
  const client = createDirectus<Schema>(baseUrl, options || {})
    .with(rest())
    .with(graphql())
  return {
    client,
  }
}

export const DirectusPlugin: Plugin = {
  install(app) {
    const baseUrl = import.meta.env.VITE_DIRECTUS_HOST
    const client = DirectusFactory(baseUrl)
    app.provide('directus', client)
  },
}
