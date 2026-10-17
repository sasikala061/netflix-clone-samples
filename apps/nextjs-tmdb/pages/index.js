import React, { useEffect, useState } from 'react'
export default function Home() {
  const [movies, setMovies] = useState([])
  useEffect(() => {
    setMovies([{ id: 1, title: 'Mock Movie', overview: 'Add TMDB_API_KEY' }])
  }, [])
  return (
    <main style={{padding:24}}>
      <h1>Next.js TMDB Demo</h1>
      <ul>
        {movies.map(m => <li key={m.id}><strong>{m.title}</strong></li>)}
      </ul>
    </main>
  )
}
