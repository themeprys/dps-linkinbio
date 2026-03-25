<script setup lang="ts">
type LatestPostItem = {
  id: number
  link: string
  date: string
  title: string
  thumbUrl: string | null
}

function formatDateId(dateIso: string) {
  const d = new Date(dateIso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const { data, error, pending } = useLazyAsyncData(
  'denpasastra:latest-posts',
  () =>
    $fetch<LatestPostItem[]>('/api/latest-posts', {
      headers: { Accept: 'application/json' }
    }),
  { server: false }
)

const posts = computed(() => (data.value ?? []).slice(0, 12))

useHead({
  title: 'Denpasastra — Latest Posts',
  meta: [
    {
      name: 'description',
      content: 'Landing page SSR berisi 12 postingan terakhir dari denpasastra.net.'
    }
  ]
})
</script>

<template>
  <main class="page">
    <header class="header">
      <div class="brand">
        <div class="dot" aria-hidden="true" />
        <div class="brand-text">
          <h1>Denpasastra</h1>
          <p>12 postingan terbaru</p>
        </div>
      </div>
      <a class="cta" href="https://denpasastra.net" rel="noopener noreferrer">Kunjungi blog</a>
    </header>

    <section v-if="error" class="state">
      <h2>Gagal memuat postingan</h2>
      <p>Coba refresh halaman.</p>
    </section>

    <section
      v-else-if="pending"
      class="list list--skeleton"
      aria-busy="true"
      aria-label="Memuat postingan terbaru"
    >
      <div v-for="n in 12" :key="n" class="card card--skeleton">
        <div class="skeleton-thumb" aria-hidden="true" />
        <div class="skeleton-meta">
          <div class="skeleton-line skeleton-line--title" />
          <div class="skeleton-line skeleton-line--title short" />
          <div class="skeleton-line skeleton-line--date" />
        </div>
      </div>
    </section>

    <section v-else class="list" aria-label="Daftar postingan terbaru">
      <a
        v-for="post in posts"
        :key="post.id"
        class="card"
        :href="post.link"
        rel="noopener noreferrer"
      >
        <div class="thumb" :class="{ 'thumb--empty': !post.thumbUrl }">
          <img
            v-if="post.thumbUrl"
            class="thumb-img"
            :src="post.thumbUrl"
            :srcset="`${post.thumbUrl} 320w, ${post.thumbUrl} 480w`"
            sizes="84px"
            width="96"
            height="96"
            :alt="post.title"
            loading="lazy"
            decoding="async"
            referrerpolicy="no-referrer"
          />
          <div v-else class="thumb-fallback" aria-hidden="true">DS</div>
        </div>

        <div class="meta">
          <h2 class="title">
            {{ post.title }}
          </h2>
          <p class="date">{{ formatDateId(post.date) }}</p>
        </div>
      </a>
    </section>
    <div class="cta-footer">
      <a class="cta-footer-link" href="https://denpasastra.net" rel="noopener noreferrer">Baca Lebih Banyak</a>
    </div>
  </main>
</template>

<style scoped>
.page {
  min-height: 100dvh;
  background: #f7f2ea;
  color: #121212;
  padding: 18px 14px 28px;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji",
    "Segoe UI Emoji";
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 980px;
  margin: 0 auto 14px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: #111;
  box-shadow: 0 0 0 6px rgba(17, 17, 17, 0.08);
}

.brand-text {
  min-width: 0;
}

.brand-text h1 {
  font-size: 18px;
  line-height: 1.2;
  margin: 0;
  letter-spacing: -0.01em;
}

.brand-text p {
  margin: 2px 0 0;
  font-size: 13px;
  opacity: 0.7;
}

.cta {
  flex: 0 0 auto;
  font-size: 13px;
  font-weight: 600;
  color: #111;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(17, 17, 17, 0.08);
  border: 1px solid rgba(17, 17, 17, 0.12);
}

.cta:active {
  transform: translateY(1px);
}

.state {
  max-width: 980px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  padding: 16px;
}

.state h2 {
  font-size: 16px;
  margin: 0 0 6px;
}

.state p {
  margin: 0;
  opacity: 0.75;
  font-size: 14px;
}

.list {
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list--skeleton {
  pointer-events: none;
}

.card--skeleton {
  cursor: default;
}

.skeleton-thumb {
  width: 84px;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(
    110deg,
    rgba(0, 0, 0, 0.06) 0%,
    rgba(0, 0, 0, 0.1) 45%,
    rgba(0, 0, 0, 0.06) 90%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.15s ease-in-out infinite;
}

.skeleton-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(
    110deg,
    rgba(0, 0, 0, 0.06) 0%,
    rgba(0, 0, 0, 0.09) 45%,
    rgba(0, 0, 0, 0.06) 90%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.15s ease-in-out infinite;
}

.skeleton-line--title {
  max-width: 100%;
}

.skeleton-line--title.short {
  max-width: 72%;
}

.skeleton-line--date {
  width: 96px;
  height: 10px;
  margin-top: 2px;
  opacity: 0.85;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.card {
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(0, 0, 0, 0.08);
  text-decoration: none;
  color: inherit;
  backdrop-filter: blur(8px);
  -webkit-tap-highlight-color: transparent;
}

.card:focus-visible {
  outline: 2px solid rgba(17, 17, 17, 0.45);
  outline-offset: 2px;
}

.thumb {
  width: 84px;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.08);
  display: grid;
  place-items: center;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: rgba(17, 17, 17, 0.55);
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.02));
}

.meta {
  min-width: 0;
}

.title {
  margin: 0;
  font-size: 15px;
  line-height: 1.25;
  letter-spacing: -0.01em;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.date {
  margin: 8px 0 0;
  font-size: 12px;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 6px;
}

.date::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(17, 17, 17, 0.28);
}

@media (min-width: 640px) {
  .page {
    padding: 26px 18px 40px;
  }

  .brand-text h1 {
    font-size: 20px;
  }

  .card {
    grid-template-columns: 96px 1fr;
    padding: 14px;
  }

  .thumb {
    width: 96px;
    border-radius: 16px;
  }

  .skeleton-thumb {
    width: 96px;
    border-radius: 16px;
  }

  .title {
    font-size: 16px;
  }
}

@media (hover: hover) {
  .card:hover {
    border-color: rgba(0, 0, 0, 0.12);
    background: rgba(255, 255, 255, 0.82);
  }

  .cta:hover {
    background: rgba(17, 17, 17, 0.1);
  }
}

.cta-footer 
{
  background: #fff;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 24px;
}

.cta-footer-link {
  font-size: 14px;
  color: #111;
  text-decoration: none;
  font-weight: bold;
}
</style>
