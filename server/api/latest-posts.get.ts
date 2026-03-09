type WpFeaturedMedia = {
  source_url?: string
  media_details?: {
    sizes?: Record<string, { source_url?: string }>
  }
}

type WpPost = {
  id: number
  link: string
  date: string
  title: { rendered: string }
  _embedded?: { 'wp:featuredmedia'?: WpFeaturedMedia[] }
}

export type LatestPostItem = {
  id: number
  link: string
  date: string
  title: string
  thumbUrl: string | null
}

function stripTags(input: string) {
  return input.replace(/<[^>]*>/g, '')
}

function decodeHtmlEntities(input: string) {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)))
}

function pickSquareThumb(post: WpPost) {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  const sizes = media?.media_details?.sizes
  return (
    sizes?.['penci-thumb-280-280']?.source_url ||
    sizes?.['penci-thumb-480-480']?.source_url ||
    sizes?.thumbnail?.source_url ||
    sizes?.medium?.source_url ||
    media?.source_url ||
    null
  )
}

const WP_ENDPOINT = 'https://denpasastra.net/wp-json/wp/v2/posts?per_page=12&_embed=1'

export default cachedEventHandler(
  async () => {
    const posts = await $fetch<WpPost[]>(WP_ENDPOINT, {
      headers: { Accept: 'application/json' }
    })

    const items: LatestPostItem[] = (posts ?? []).slice(0, 12).map((p) => ({
      id: p.id,
      link: p.link,
      date: p.date,
      title: decodeHtmlEntities(stripTags(p.title?.rendered ?? '')).trim(),
      thumbUrl: pickSquareThumb(p)
    }))

    return items
  },
  {
    // Cache in Nitro storage to avoid hitting WP on every SSR request.
    // Short TTL keeps it fresh while improving TTFB and stability.
    maxAge: 60 * 5,
    staleMaxAge: 60 * 10
  }
)

