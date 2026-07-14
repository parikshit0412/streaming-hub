"use client";

import { useState, useEffect } from 'react';

interface Movie {
  id: number | string;
  title: string;
  description: string;
  poster: string;
  videoUrl: string;
  duration: string;
  rating: string;
}

const PRESET_POSTERS = [
  { name: 'Action', url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
  { name: 'Sci-Fi', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
  { name: 'Adventure', url: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
  { name: 'Cyberpunk', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }
];

const DEFAULT_MOVIES: Movie[] = [
  {
    id: 1,
    title: "Big Buck Bunny",
    description: "A large and lovable rabbit deals with three bullying rodents in a forest.",
    poster: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "9:56",
    rating: "8.5"
  },
  {
    id: 2,
    title: "Sintel",
    description: "A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales.",
    poster: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    duration: "14:48",
    rating: "8.9"
  },
  {
    id: 3,
    title: "Tears of Steel",
    description: "A group of warriors and scientists try to save the world from destructive giant robots.",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "12:14",
    rating: "8.2"
  }
];

export default function WatchlistPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Authentication states
  const [currentUser, setCurrentUser] = useState<{ email: string, name: string } | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isIframe, setIsIframe] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newRating, setNewRating] = useState('8.0');
  const [newDuration, setNewDuration] = useState('2h 00m');
  const [newPoster, setNewPoster] = useState(PRESET_POSTERS[0].url);
  const [customPoster, setCustomPoster] = useState('');

  // Handle postMessage authentication
  useEffect(() => {
    setIsIframe(window.parent !== window);

    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'STREAMHUB_AUTH') {
        const { token, user } = event.data.payload;
        setAuthToken(token);
        setCurrentUser(user);
        console.log("Watchlist MFE: Successfully authenticated via Host!");
      }
    };

    window.addEventListener('message', handleAuthMessage);

    // Load custom watchlist from localStorage
    const saved = localStorage.getItem('streamhub_watchlist');
    if (saved) {
      try {
        setMovies(JSON.parse(saved));
      } catch (e) {
        setMovies(DEFAULT_MOVIES);
      }
    } else {
      setMovies(DEFAULT_MOVIES);
    }

    return () => window.removeEventListener('message', handleAuthMessage);
  }, []);

  // Save to localStorage whenever movies change
  const saveToLocalStorage = (updatedMovies: Movie[]) => {
    setMovies(updatedMovies);
    localStorage.setItem('streamhub_watchlist', JSON.stringify(updatedMovies));
  };

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const posterUrl = customPoster.trim() ? customPoster : newPoster;
    const newMovie: Movie = {
      id: Date.now(),
      title: newTitle,
      description: newDesc || "No description provided.",
      poster: posterUrl,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      duration: newDuration,
      rating: newRating
    };

    const updated = [newMovie, ...movies];
    saveToLocalStorage(updated);

    // Reset form
    setNewTitle('');
    setNewDesc('');
    setNewRating('8.0');
    setNewDuration('2h 00m');
    setCustomPoster('');
    setIsAddModalOpen(false);
  };

  const handleRemoveMovie = (id: number | string) => {
    const updated = movies.filter(m => m.id !== id);
    saveToLocalStorage(updated);
  };

  // Secure Guard: If running in Host iframe and not yet authenticated, block the screen
  if (isIframe && !currentUser) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#09090c',
        color: 'white',
        fontFamily: "'Outfit', sans-serif"
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          padding: '3rem',
          maxWidth: '400px',
          background: 'rgba(20, 20, 25, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          backdropFilter: 'blur(25px)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '2px dashed #e50914',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            boxShadow: '0 0 25px rgba(229, 9, 20, 0.35)',
            animation: 'spin 3s linear infinite'
          }}>
            🔒
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Access Gated via Host</h2>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>Verifying MFE credentials...</p>
        </div>
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      {/* Standalone Bypass Alert Banner */}
      {!isIframe && (
        <div style={{ 
          background: 'rgba(59, 130, 246, 0.1)', 
          border: '1px solid rgba(59, 130, 246, 0.2)', 
          color: '#93c5fd', 
          padding: '0.8rem 1.5rem', 
          borderRadius: '8px', 
          fontSize: '0.85rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>ℹ️ Running MFE in <strong>Standalone Dev Mode</strong> (Auth Gating is bypassed for development convenience).</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>URL: http://localhost:4203</span>
        </div>
      )}

      <header className="page-header">
        <div>
          <h1 className="page-title">My Watchlist</h1>
          <p className="page-subtitle">
            {currentUser ? `Welcome back, ${currentUser.name}! ` : ''}Manage your personalized queue of movies and shows.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          ➕ Add Custom Movie
        </button>
      </header>

      <main className="watchlist-grid">
        {movies.map((movie) => (
          <div className="glass-panel" key={movie.id}>
            <div 
              className="poster-area" 
              style={{ backgroundImage: `url(${movie.poster})` }}
            >
              <div className="poster-overlay">
                <button className="btn btn-primary" onClick={() => setActiveVideo(movie.videoUrl)}>
                  ▶ Play Now
                </button>
              </div>
            </div>
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-desc">{movie.description}</p>
              <div className="movie-meta">
                <span>{movie.duration}</span>
                <span className="rating">★ {movie.rating}</span>
              </div>
              <div className="movie-actions">
                <button className="btn btn-primary" style={{ flexGrow: 1 }} onClick={() => setActiveVideo(movie.videoUrl)}>
                  ▶ Play
                </button>
                <button className="btn btn-danger" onClick={() => handleRemoveMovie(movie.id)}>
                  ✕ Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Dashed Add Card */}
        <div className="add-card" onClick={() => setIsAddModalOpen(true)}>
          <span className="add-icon">➕</span>
          <h3>Add Movie to List</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'center', padding: '0 1rem' }}>
            Expand your custom queue dynamically
          </p>
        </div>
      </main>

      {/* Add Movie Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Add Custom Movie</h2>
            <form onSubmit={handleAddMovie}>
              <div className="form-group">
                <label>Movie Title *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  required 
                  placeholder="e.g. Inception"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  className="form-input" 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)} 
                  rows={2}
                  placeholder="Short movie summary..."
                />
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Rating (0.0 - 10.0)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    max="10" 
                    className="form-input" 
                    value={newRating} 
                    onChange={(e) => setNewRating(e.target.value)}
                  />
                </div>
                <div>
                  <label>Duration</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newDuration} 
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="e.g. 1h 45m"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Choose Preset Poster Image</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {PRESET_POSTERS.map((preset) => (
                    <button 
                      key={preset.name}
                      type="button"
                      className={`btn ${newPoster === preset.url && !customPoster ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      onClick={() => {
                        setNewPoster(preset.url);
                        setCustomPoster('');
                      }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                <label>Or enter custom Image URL</label>
                <input 
                  type="url" 
                  className="form-input" 
                  value={customPoster} 
                  onChange={(e) => setCustomPoster(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save to List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {activeVideo && (
        <div className="modal-overlay" onClick={() => setActiveVideo(null)}>
          <button 
            onClick={() => setActiveVideo(null)}
            style={{
              position: 'absolute',
              top: '30px',
              left: '30px',
              background: 'rgba(20, 20, 25, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'white',
              padding: '0.7rem 1.4rem',
              borderRadius: '30px',
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease',
              zIndex: 1010
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #e50914 0%, #ff3b47 100%)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(229, 9, 20, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(20, 20, 25, 0.8)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
            }}
          >
            ← Back to List
          </button>
          
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '80%', maxWidth: '1000px', zIndex: 1005 }}>
            <video 
              src={activeVideo} 
              controls 
              autoPlay 
              className="video-frame"
              style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
