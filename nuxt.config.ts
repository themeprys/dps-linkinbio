// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    compressPublicAssets: true
  },
  routeRules: {
    '/': {
      headers: {
        // Allow short caching at the edge/CDN while SSR stays fresh.
        'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
      }
    }
  }
})
