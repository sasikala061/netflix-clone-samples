import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const FALLBACK_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const fallbackRows = {
  trending: {
    title: 'Trending Now',
    items: [
      { id: 1, title: 'Big Buck Bunny', overview: 'A playful rabbit rebels against a tyrannical rabbit hunter.', poster_path: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217', backdrop_path: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png', release_date: '2008', vote_average: 8.6 },
      { id: 2, title: 'Sintel', overview: 'A young woman journeys through a mysterious world filled with danger.', poster_path: 'https://durian.blender.org/wp-content/uploads/2010/05/sintel_poster.jpg', backdrop_path: 'https://durian.blender.org/wp-content/uploads/2010/05/sintel_still1.jpg', release_date: '2010', vote_average: 8.4 },
      { id: 3, title: 'Spring', overview: 'A tiny creature discovers the wonder of spring and rebirth.', poster_path: 'https://media.blender.org/film/spring/spring-poster.jpg', backdrop_path: 'https://media.blender.org/film/spring/spring-still.jpg', release_date: '2019', vote_average: 8.1 }
    ]
  },
  top_rated: { title: 'Top Rated', items: [
    { id: 4, title: 'Tears of Steel', overview: 'A dystopian future where a group fights to protect the last sanctuary of humanity.', poster_path: 'https://mango.blender.org/wp-content/uploads/2013/05/tears_of_steel_poster.jpg', backdrop_path: 'https://mango.blender.org/wp-content/uploads/2013/05/tears_of_steel_2.jpg', release_date: '2012', vote_average: 8.7 },
    { id: 5, title: 'Elephants Dream', overview: 'Two strange characters explore a surreal world full of contradiction.', poster_path: 'https://orange.blender.org/wp-content/uploads/2010/08/elephants-dream-poster.jpg', backdrop_path: 'https://orange.blender.org/wp-content/uploads/2010/08/elephants_dream_01.jpg', release_date: '2006', vote_average: 8.3 },
    { id: 6, title: 'Cosmos Laundromat', overview: 'A comedic short film blending eccentric characters and cosmic absurdity.', poster_path: 'https://cosmos-laundromat.com/wp-content/uploads/2015/02/poster.jpg', backdrop_path: 'https://cosmos-laundromat.com/wp-content/uploads/2015/02/still.jpg', release_date: '2015', vote_average: 8.1 }
  ] },
  now_playing: { title: 'Now Playing', items: [
    { id: 7, title: 'Heroic', overview: 'A documentary about everyday heroes and the stories that inspire communities.', poster_path: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80', backdrop_path: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', release_date: '2024', vote_average: 8.0 },
    { id: 8, title: 'Night Shift', overview: 'A thrilling story of people working through the night to protect the city.', poster_path: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80', backdrop_path: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80', release_date: '2024', vote_average: 7.8 },
    { id: 9, title: 'City Echo', overview: 'A story of resilience, identity, and the harmony of a changing city.', poster_path: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=500&q=80', backdrop_path: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1200&q=80', release_date: '2024', vote_average: 7.9 }
  ] },
  upcoming: { title: 'Upcoming', items: [
    { id: 10, title: 'Neon Tide', overview: 'A mysterious voyage through a neon-lit world of promise and danger.', poster_path: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80', backdrop_path: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80', release_date: '2025', vote_average: 8.2 },
    { id: 11, title: 'Signal Fade', overview: 'A group searches the last unknown corners of the world for lost signals.', poster_path: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=500&q=80', backdrop_path: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80', release_date: '2025', vote_average: 8.1 },
    { id: 12, title: 'Glass Horizon', overview: 'A delicate reflection on ambition, memory, and the cost of progress.', poster_path: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=500&q=80', backdrop_path: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80', release_date: '2025', vote_average: 8.4 }
  ] }
};

function toTmdbImage(path: string | null | undefined) {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/w500${path}`;
}

async function fetchTmdb(path: string) {
  if (!TMDB_API_KEY) {
    return null;
  }

  const url = `https://api.themoviedb.org/3${path}${path.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

async function buildRows() {
  if (!TMDB_API_KEY) {
    return [
      { title: fallbackRows.trending.title, items: fallbackRows.trending.items },
      { title: fallbackRows.top_rated.title, items: fallbackRows.top_rated.items },
      { title: fallbackRows.now_playing.title, items: fallbackRows.now_playing.items },
      { title: fallbackRows.upcoming.title, items: fallbackRows.upcoming.items },
    ];
  }

  const [trending, topRated, nowPlaying, upcoming] = await Promise.all([
    fetchTmdb('/trending/movie/week?language=en-US'),
    fetchTmdb('/movie/top_rated?language=en-US'),
    fetchTmdb('/movie/now_playing?language=en-US'),
    fetchTmdb('/movie/upcoming?language=en-US')
  ]);

  const rows = [
    { title: 'Trending Now', items: (trending?.results || []).map((movie: any) => ({ ...movie, title: movie.title || movie.name })) },
    { title: 'Top Rated', items: (topRated?.results || []).map((movie: any) => ({ ...movie, title: movie.title || movie.name })) },
    { title: 'Now Playing', items: (nowPlaying?.results || []).map((movie: any) => ({ ...movie, title: movie.title || movie.name })) },
    { title: 'Upcoming', items: (upcoming?.results || []).map((movie: any) => ({ ...movie, title: movie.title || movie.name })) },
  ];

  return rows.filter((row) => row.items.length > 0).slice(0, 4);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'rows';
  const query = searchParams.get('q') || '';
  const id = searchParams.get('id');

  if (type === 'details' && id) {
    if (!TMDB_API_KEY) {
      const fallback = Object.values(fallbackRows)
        .flatMap((row) => row.items)
        .find((movie: any) => String(movie.id) === String(id));

      return NextResponse.json({
        ...fallback,
        videoKey: null,
        videoUrl: FALLBACK_VIDEO,
        fallbackVideo: true,
      });
    }

    const [movieData, videoData] = await Promise.all([
      fetchTmdb(`/movie/${id}?language=en-US`),
      fetchTmdb(`/movie/${id}/videos?language=en-US`),
    ]);

    const trailer = (videoData?.results || []).find((item: any) => item.site === 'YouTube' && (item.type === 'Trailer' || item.type === 'Teaser'))
      || (videoData?.results || []).find((item: any) => item.site === 'YouTube');

    return NextResponse.json({
      ...movieData,
      title: movieData?.title || movieData?.name,
      videoKey: trailer?.key || null,
      videoUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=1&rel=0` : FALLBACK_VIDEO,
      fallbackVideo: !trailer,
    });
  }

  if (type === 'search' && query) {
    if (!TMDB_API_KEY) {
      const items = Object.values(fallbackRows)
        .flatMap((row) => row.items)
        .filter((movie: any) => (movie.title || '').toLowerCase().includes(query.toLowerCase()));

      return NextResponse.json({ rows: [{ title: 'Search Results', items }] });
    }

    const data = await fetchTmdb(`/search/movie?query=${encodeURIComponent(query)}&language=en-US`);
    return NextResponse.json({
      rows: [{ title: 'Search Results', items: (data?.results || []).map((movie: any) => ({ ...movie, title: movie.title || movie.name })) }],
    });
  }

  const rows = await buildRows();
  return NextResponse.json({ rows });
}
