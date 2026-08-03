import { Movie, MovieCategory } from './models';

/**
 * Centralized Master Movie Catalog for StreamHub Monorepo
 */
export const STREAMHUB_CATALOG: Movie[] = [
  {
    id: 1,
    title: "Big Buck Bunny",
    description: "A large and lovable rabbit deals with three bullying rodents in a beautiful forest.",
    poster: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "9:56",
    rating: "8.5",
    category: "Animation & Family",
    match: "96%"
  },
  {
    id: 2,
    title: "Elephants Dream",
    description: "The first computer-generated open movie featuring surreal mind-bending visuals.",
    poster: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    duration: "10:53",
    rating: "7.8",
    category: "Sci-Fi & Fantasy",
    match: "89%"
  },
  {
    id: 3,
    title: "Sintel",
    description: "A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales.",
    poster: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    duration: "14:48",
    rating: "8.9",
    category: "Sci-Fi & Fantasy",
    match: "98%"
  },
  {
    id: 4,
    title: "Tears of Steel",
    description: "A group of warriors and scientists try to save the world from destructive giant robots.",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "12:14",
    rating: "8.2",
    category: "Action & Adventure",
    match: "92%"
  },
  {
    id: 5,
    title: "Cyber Heist",
    description: "A team of elite hackers must steal a quantum computer before it falls into the wrong hands.",
    poster: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    duration: "2h 10m",
    rating: "9.1",
    category: "Action & Adventure",
    match: "98%"
  },
  {
    id: 6,
    title: "Neon Genesis",
    description: "In a dystopian future, a rogue artificial intelligence fights for the survival of humanity.",
    poster: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "1h 45m",
    rating: "8.7",
    category: "Sci-Fi & Fantasy",
    match: "85%"
  },
  {
    id: 7,
    title: "Desert Storm",
    description: "A thrilling tale of survival and strategy set in an unforgiving radioactive wasteland.",
    poster: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    duration: "2h 05m",
    rating: "7.9",
    category: "Action & Adventure",
    match: "91%"
  },
  {
    id: 8,
    title: "Arctic Pursuit",
    description: "An intense high-stakes action thriller set across the frozen northern tundra.",
    poster: "https://images.unsplash.com/photo-1478265409131-1f65c88f965c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "1h 55m",
    rating: "8.4",
    category: "Action & Adventure",
    match: "78%"
  },
  {
    id: 9,
    title: "Beyond the Stars",
    description: "An epic space exploration journey across uncharted galaxies to locate humanity's next home.",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    duration: "2h 30m",
    rating: "9.5",
    category: "Sci-Fi & Fantasy",
    match: "95%"
  },
  {
    id: 10,
    title: "The Martian Outpost",
    description: "Pioneer colonists on Mars uncover an ancient underground secret that threatens the mission.",
    poster: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "1h 50m",
    rating: "8.8",
    category: "Sci-Fi & Fantasy",
    match: "88%"
  }
];

/**
 * Curated Movie Categories for Browse MFE
 */
export const FEATURED_CATEGORIES: MovieCategory[] = [
  {
    name: "Action & Adventure",
    movies: STREAMHUB_CATALOG.filter(m => m.category === "Action & Adventure")
  },
  {
    name: "Sci-Fi & Fantasy",
    movies: STREAMHUB_CATALOG.filter(m => m.category === "Sci-Fi & Fantasy")
  }
];

/**
 * Default Seed Watchlist for Watchlist MFE
 */
export const DEFAULT_WATCHLIST_MOVIES: Movie[] = STREAMHUB_CATALOG.slice(0, 3);

/**
 * Helper Utilities
 */
export function getHeroMovie(): Movie {
  return STREAMHUB_CATALOG[0];
}

export function getTrendingMovies(): Movie[] {
  return STREAMHUB_CATALOG.slice(1);
}

export function searchCatalog(query: string): Movie[] {
  const q = query.toLowerCase().trim();
  if (!q) return STREAMHUB_CATALOG;
  return STREAMHUB_CATALOG.filter(m => 
    m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
  );
}
