import React from 'react'

const IMAGE_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p/w500'
const API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || ''

type Movie = {
  id: number
  title?: string
  name?: string
  poster_path?: string | null
  backdrop_path?: string | null
}

async function fetchMovies(path: string): Promise<Movie[]> {
  if (!API_KEY) return []
  const url = `https://api.themoviedb.org/3${path}${path.includes('?') ? '&' : '?'}api_key=${API_KEY}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    console.error('TMDB fetch failed', url, res.status)
    return []
  }
  const json = await res.json()
  return json.results || []
}

function Poster({ movie }: { movie: Movie }) {
  const path = movie.poster_path || movie.backdrop_path
  const src = path ? `${IMAGE_BASE}${path}` : '/placeholder.png'
  const title = movie.title || movie.name || 'Untitled'
  return (
    <div className="rounded overflow-hidden bg-gray-900">
      <img src={src} alt={title} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
      <div style={{ padding: '6px', color: '#fff', fontSize: '12px' }}>{title}</div>
    </div>
  )
}

export default async function Page() {
  // Server component
  if (!API_KEY) {
    return (
      <main style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#E50914', fontSize: 28, marginBottom: 12 }}>Netflix-style Demo</h1>
          <p style={{ opacity: 0.85 }}>Missing TMDB API key. Add TMDB_API_KEY to apps/nextjs-fullstack/.env.local (or NEXT_PUBLIC_TMDB_API_KEY)</p>
          <p style={{ marginTop: 8, opacity: 0.75 }}>Get a free key at https://www.themoviedb.org/</p>
        </div>
      </main>
    )
  }

  const [trending, topRated, originals] = await Promise.all([
    fetchMovies('/trending/all/week'),
    fetchMovies('/movie/top_rated'),
    // Discover TV shows on Netflix (network id 213) — common technique for "Netflix Originals"
    fetchMovies('/discover/tv?with_networks=213')
  ])

  return (
    <main style={{ minHeight: '100vh', background: '#000', color: '#fff', paddingBottom: 48 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 20 }}>
        <div style={{ width: 120, height: 40, background: '#E50914', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, borderRadius: 4 }}>NETFLIX</div>
        <h1 style={{ fontSize: 20 }}>Netflix-style Demo</h1>
      </header>

      <section style={{ padding: '0 20px 24px 20px' }}>
        <h2 style={{ color: '#fff', margin: '12px 0' }}>Trending</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {trending.map((m) => (
            <Poster key={m.id} movie={m} />
          ))}
        </div>
      </section>

      <section style={{ padding: '0 20px 24px 20px' }}>
        <h2 style={{ color: '#fff', margin: '12px 0' }}>Top Rated</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {topRated.map((m) => (
            <Poster key={m.id} movie={m} />
          ))}
        </div>
      </section>

      <section style={{ padding: '0 20px 24px 20px' }}>
        <h2 style={{ color: '#fff', margin: '12px 0' }}>Netflix Originals</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {originals.map((m) => (
            <Poster key={m.id} movie={m} />
          ))}
        </div>
      </section>
    </main>
  )
}
