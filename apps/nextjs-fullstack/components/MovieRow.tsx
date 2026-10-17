"use client"

import React, { useRef, useState } from 'react'
import Image from 'next/image'

type Movie = {
  id: number
  title?: string
  name?: string
  poster_path?: string | null
  backdrop_path?: string | null
  overview?: string | null
}

export default function MovieRow({ title, movies, imageBase }: { title: string; movies: Movie[]; imageBase: string }) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.9)
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <section style={{ padding: '12px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ color: '#fff', margin: 0 }}>{title}</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button aria-label="scroll-left" onClick={() => scroll('left')} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', padding: '6px 8px', borderRadius: 4 }}>◀</button>
          <button aria-label="scroll-right" onClick={() => scroll('right')} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', padding: '6px 8px', borderRadius: 4 }}>▶</button>
        </div>
      </div>

      <div ref={scrollRef} style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'thin' }}>
        {movies.map((m) => {
          const path = m.poster_path || m.backdrop_path
          const src = path ? `${imageBase.replace('/original', '/w500')}${path}` : '/placeholder.png'
          const titleText = m.title || m.name || 'Untitled'
          const isHovered = hovered === m.id

          return (
            <div key={m.id} onMouseEnter={() => setHovered(m.id)} onMouseLeave={() => setHovered(null)} style={{ minWidth: 180, position: 'relative', cursor: 'pointer' }}>
              <div style={{ background: '#111', borderRadius: 6, overflow: 'hidden' }}>
                <Image src={src} alt={titleText} width={180} height={270} style={{ objectFit: 'cover', display: 'block' }} />
              </div>

              <div style={{ transition: 'all 180ms ease', position: 'absolute', left: 6, right: 6, bottom: 6, padding: 8, borderRadius: 6, background: isHovered ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.25)', color: '#fff', fontSize: 13, maxHeight: 140, overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{titleText}</div>
                <div style={{ opacity: isHovered ? 0.95 : 0.0, maxHeight: isHovered ? 72 : 0, transition: 'opacity 180ms ease, max-height 180ms ease' }}>{m.overview}</div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
