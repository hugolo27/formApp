/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_PRIMARY_COLOR: string
  readonly VITE_PRIMARY_COLOR_HOVER: string
  readonly VITE_MAX_WIDTH: string
  readonly VITE_SNACKBAR_DURATION: string
  readonly VITE_REDIRECT_DELAY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 