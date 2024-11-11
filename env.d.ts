/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_DIRECTUS_HOST: string
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
