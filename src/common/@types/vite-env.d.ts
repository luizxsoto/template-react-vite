/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Application
  readonly VITE_NODE_ENV: string
  readonly VITE_HOST: string
  readonly VITE_PORT: string
  readonly VITE_IDLE_TIMEOUT_IN_MINUTES: string
  readonly VITE_COVERAGE_ENABLED: string

  // Template React Vite
  readonly VITE_TEMPLATE_REACT_VITE_API_URL: string
}
