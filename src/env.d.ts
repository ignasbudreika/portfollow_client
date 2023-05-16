/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_ACCESS_TOKEN_KEY: string;
  readonly VITE_SERVER_BASE_URL: string;
  readonly VITE_OAUTH2_REDIRECT_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}