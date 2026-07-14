import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import './app.module.css';

const queryClient = new QueryClient();

// Sample movie data with Big Buck Bunny as demo video
const mockMovies = [
  {
    id: 1,
    title: "Big Buck Bunny",
    description: "A large and lovable rabbit deals with three bullying rodents in a beautiful forest.",
    poster: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "9:56",
    rating: "8.5"
  },
  {
    id: 2,
    title: "Elephants Dream",
    description: "The first computer-generated animated short film with mind-bending visuals.",
    poster: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    duration: "10:53",
    rating: "7.8"
  },
  {
    id: 3,
    title: "Sintel",
    description: "A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales.",
    poster: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    duration: "14:48",
    rating: "8.9"
  },
  {
    id: 4,
    title: "Tears of Steel",
    description: "A group of warriors and scientists try to save the world from destructive giant robots.",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "12:14",
    rating: "8.2"
  },
  {
    id: 5,
    title: "Cyber Heist",
    description: "A team of hackers must steal a quantum computer before it falls into the wrong hands.",
    poster: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    duration: "2:10:00",
    rating: "9.1"
  },
  {
    id: 6,
    title: "Neon Genesis",
    description: "In a dystopian future, a rogue AI fights for the survival of humanity.",
    poster: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "1:45:00",
    rating: "8.7"
  },
  {
    id: 7,
    title: "Desert Storm",
    description: "A thrilling tale of survival in an unforgiving wasteland.",
    poster: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    duration: "2:05:00",
    rating: "7.9"
  },
  {
    id: 8,
    title: "Arctic Pursuit",
    description: "An intense thriller set in the frozen tundra.",
    poster: "https://images.unsplash.com/photo-1478265409131-1f65c88f965c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "1:55:00",
    rating: "8.4"
  },
  {
    id: 9,
    title: "Beyond the Stars",
    description: "An epic journey across the galaxy to find a new home.",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    duration: "2:30:00",
    rating: "9.5"
  },
  {
    id: 10,
    title: "The Martian Outpost",
    description: "Colonists on Mars uncover a secret that could change everything.",
    poster: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "1:50:00",
    rating: "8.8"
  }
];

const fetchTrending = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMovies;
};

function Login({ onLogin }: { onLogin: (email: string, name: string) => void }) {
  const [email, setEmail] = useState('user@streamhub.demo');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.length >= 6) {
      onLogin(email, 'Test User');
    } else {
      setError('Invalid credentials (password must be at least 6 characters).');
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#09090c',
      color: 'white',
      fontFamily: "'Outfit', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glowing Ambient Orbs */}
      <div style={{
        position: 'absolute',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'rgba(229, 9, 20, 0.15)',
        filter: 'blur(80px)',
        top: '20%',
        left: '30%',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'rgba(59, 130, 246, 0.12)',
        filter: 'blur(80px)',
        bottom: '20%',
        right: '30%',
        zIndex: 1
      }} />

      <div className="glass-panel" style={{
        width: '420px',
        padding: '3.5rem 3rem',
        boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        position: 'relative',
        zIndex: 10,
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            background: 'linear-gradient(135deg, #e50914 0%, #ff3b47 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
            letterSpacing: '-0.025em'
          }}>🎬 StreamHub</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Enter credentials to access MFE portal</p>
        </div>

        {error && (
          <div style={{ 
            color: '#f87171', 
            background: 'rgba(239, 68, 68, 0.08)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            padding: '0.8rem 1rem', 
            borderRadius: '8px', 
            fontSize: '0.85rem' 
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
            <div className="form-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingRight: '3.5rem' }}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  outline: 'none'
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', fontSize: '1rem', width: '100%', marginTop: '1rem' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

function VideoModal({ videoUrl, onClose }: { videoUrl: string, onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(20px)'
    }}>
      {/* Floating Back Button */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          background: 'rgba(20, 20, 25, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: 'white',
          padding: '0.7rem 1.4rem',
          borderRadius: '30px',
          fontFamily: "'Outfit', sans-serif",
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
        ← Back to Dashboard
      </button>

      <div style={{ width: '80%', maxWidth: '1200px', zIndex: 1005 }}>
        <video 
          controls 
          autoPlay 
          style={{ 
            width: '100%', 
            borderRadius: '16px', 
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
          src={videoUrl}
        />
      </div>
    </div>
  );
}

function Navbar({ activeTab, setActiveTab, onLogout, userName }: { activeTab: string, setActiveTab: (t: string) => void, onLogout: () => void, userName: string }) {
  return (
    <nav className="glass-nav">
      <div 
        style={{ 
          fontSize: '1.7rem', 
          fontWeight: 800, 
          background: 'linear-gradient(135deg, #e50914 0%, #ff3b47 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          cursor: 'pointer',
          letterSpacing: '-0.025em'
        }}
        onClick={() => setActiveTab('home')}
      >
        🎬 StreamHub
      </div>
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        <button onClick={() => setActiveTab('home')} className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}>Home</button>
        <button onClick={() => setActiveTab('browse')} className={`nav-link ${activeTab === 'browse' ? 'active' : ''}`}>Browse MFE (Vue)</button>
        <button onClick={() => setActiveTab('watchlist')} className={`nav-link ${activeTab === 'watchlist' ? 'active' : ''}`}>Watchlist MFE (Next.js)</button>
        <button onClick={() => setActiveTab('settings')} className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}>Settings MFE (Angular)</button>
      </div>
      <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
        <button className="btn btn-secondary" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}>🔍</button>
        <button className="btn btn-secondary" style={{ 
          borderRadius: '50%', 
          width: '40px', 
          height: '40px', 
          padding: 0, 
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
          color: 'white', 
          border: 'none',
          boxShadow: '0 4px 10px rgba(59, 130, 246, 0.35)',
          fontWeight: 600
        }}>
          {userName.charAt(0).toUpperCase()}
        </button>
        <button className="btn btn-secondary" onClick={onLogout} style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>Logout</button>
      </div>
    </nav>
  );
}

function Hero({ movie, onPlay }: { movie: any, onPlay: (url: string) => void }) {
  return (
    <div style={{
      position: 'relative',
      height: '85vh',
      width: '100%',
      backgroundImage: `url(${movie.poster})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center 20%',
      display: 'flex',
      alignItems: 'center',
      padding: '0 4rem'
    }}>
      {/* Dark Cinematic Vignette overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to right, rgba(9,9,12,1) 0%, rgba(9,9,12,0.4) 60%, rgba(9,9,12,0) 100%), linear-gradient(to top, rgba(9,9,12,1) 0%, transparent 50%)'
      }} />
      
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '650px' }}>
        <h1 style={{ 
          fontSize: '4.5rem', 
          fontWeight: 800, 
          marginBottom: '1rem', 
          lineHeight: 1.05, 
          letterSpacing: '-0.03em',
          textShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>{movie.title}</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <span style={{ color: '#4ade80', fontWeight: 700 }}>★ {movie.rating} Rating</span>
          <span>•</span>
          <span>{movie.duration}</span>
          <span>•</span>
          <span style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>Ultra HD</span>
        </div>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          {movie.description}
        </p>
        <div style={{ display: 'flex', gap: '1.2rem' }}>
          <button className="btn btn-primary" onClick={() => onPlay(movie.videoUrl)} style={{ fontSize: '1.05rem', padding: '0.9rem 2.2rem', gap: '0.5rem' }}>
            ▶ Play Trailer
          </button>
          <button className="btn btn-secondary" style={{ fontSize: '1.05rem', padding: '0.9rem 2.2rem', gap: '0.5rem' }}>
            ℹ️ More Info
          </button>
        </div>
      </div>
    </div>
  );
}

function TrendingCard({ item, onPlay }: { item: any, onPlay: (url: string) => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="glass-panel"
      style={{ 
        overflow: 'hidden', 
        transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease, border-color 0.4s ease',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        border: isHovered ? '1px solid rgba(229, 9, 20, 0.4)' : '1px solid rgba(255,255,255,0.05)',
        height: '240px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay(item.videoUrl)}
    >
      <div style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
        {/* Poster Image */}
        <div style={{ 
          position: 'absolute', inset: 0, 
          backgroundImage: `url(${item.poster})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          opacity: isHovered ? 0.2 : 1,
          transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
        }}>
        </div>
        
        {/* Play Icon/Text Overlay on Hover */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}>
          <span style={{ 
            background: 'var(--accent-gradient)', 
            color: 'white', 
            padding: '0.5rem 1.2rem', 
            borderRadius: '30px', 
            fontSize: '0.85rem', 
            fontWeight: 700,
            boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)'
          }}>
            ▶ Play Now
          </span>
        </div>
        
        {/* Autoplay Video on Hover */}
        {isHovered && (
          <video 
            src={item.videoUrl}
            autoPlay 
            muted 
            loop
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
          />
        )}
      </div>
      <div style={{ padding: '1.2rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.4rem', fontWeight: 600, letterSpacing: '-0.01em' }}>{item.title}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <span>{item.duration}</span>
          <span style={{ color: '#4ade80', fontWeight: 600 }}>★ {item.rating}</span>
        </div>
      </div>
    </div>
  );
}

function ContentDashboard() {
  const { data, isLoading, error } = useQuery({ queryKey: ['trending'], queryFn: fetchTrending });
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (isLoading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" style={{ color: 'var(--accent-primary)', fontSize: '2rem' }}>Loading StreamHub...</div></div>;
  if (error) return <div style={{ color: 'red', padding: '2rem' }}>Error fetching data.</div>;

  const featuredMovie = data?.[0];
  const trendingList = data?.slice(1) || [];

  return (
    <div>
      {featuredMovie && <Hero movie={featuredMovie} onPlay={setActiveVideo} />}

      <div style={{ padding: '0 4rem 4rem 4rem', position: 'relative', zIndex: 10, marginTop: '-5rem' }}>
        <h2 style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Trending Now</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {trendingList.map((item: any) => (
            <TrendingCard key={item.id} item={item} onPlay={setActiveVideo} />
          ))}
        </div>
      </div>

      {activeVideo && <VideoModal videoUrl={activeVideo} onClose={() => setActiveVideo(null)} />}
    </div>
  );
}

const isProd = process.env.NODE_ENV === 'production';

const VUE_MFE_URL = isProd 
  ? '/browse/assets/index.js' 
  : 'http://localhost:4201/src/main.ts';

const ANGULAR_MFE_URL = isProd 
  ? '/settings/' 
  : 'http://localhost:4202';

const WATCHLIST_MFE_URL = isProd 
  ? '/watchlist/' 
  : 'http://localhost:4203';

function MfeLoader({ 
  scriptUrl, 
  customTagName, 
  onLoad 
}: { 
  scriptUrl: string, 
  customTagName: string, 
  onLoad?: () => void 
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const selector = `script[src="${scriptUrl}"]`;
    let script = document.querySelector(selector) as HTMLScriptElement;

    const handleLoad = () => {
      setLoaded(true);
      if (onLoad) onLoad();
    };

    const handleError = () => {
      setError(true);
    };

    if (script) {
      if (script.dataset.loaded === 'true') {
        handleLoad();
      } else {
        script.addEventListener('load', handleLoad);
        script.addEventListener('error', handleError);
      }
    } else {
      script = document.createElement('script');
      script.src = scriptUrl;
      script.type = 'module';
      script.dataset.loaded = 'false';
      
      script.addEventListener('load', () => {
        script.dataset.loaded = 'true';
        handleLoad();
      });
      script.addEventListener('error', handleError);
      
      document.body.appendChild(script);
    }

    return () => {
      if (script) {
        script.removeEventListener('load', handleLoad);
        script.removeEventListener('error', handleError);
      }
    };
  }, [scriptUrl, onLoad]);

  if (error) {
    return (
      <div style={{ color: '#ef4444', padding: '3rem', textAlign: 'center', fontFamily: "'Outfit', sans-serif" }}>
        <h3 style={{ marginBottom: '0.5rem' }}>⚠️ MFE Load Error</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Failed to load Vue Browse from {scriptUrl}. Ensure local port 4201 is running.</p>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '3px dashed #e50914',
          animation: 'spinner 3s linear infinite'
        }} />
      </div>
    );
  }

  const CustomTag = customTagName as any;
  return <CustomTag />;
}

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<{ email: string, name: string, token: string } | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Load user session on mount
  useEffect(() => {
    const saved = localStorage.getItem('streamhub_session');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        setUser(null);
      }
    }
    setAuthInitialized(true);
  }, []);

  // Sync auth state to custom element runtimes and global variables
  useEffect(() => {
    if (user && activeTab === 'browse') {
      (window as any).__POWERED_BY_HOST__ = true;
      const sendAuth = () => {
        window.postMessage({
          type: 'STREAMHUB_AUTH',
          payload: {
            token: user.token,
            user: {
              email: user.email,
              name: user.name
            }
          }
        }, '*');
        console.log("React Host MFE: Sent auth state to Custom Element window listeners.");
      };

      sendAuth();
      const timer = setTimeout(sendAuth, 200); // Re-run to ensure Vue mounted listener captures it
      return () => clearTimeout(timer);
    }
  }, [user, activeTab]);

  const handleLogin = (email: string, name: string) => {
    const session = { email, name, token: 'mock-jwt-token-streamhub-secret-xyz' };
    setUser(session);
    localStorage.setItem('streamhub_session', JSON.stringify(session));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('streamhub_session');
    setActiveTab('home');
  };

  // postMessage to iframes on load
  const handleIframeLoad = (iframeId: string, contentWindow: Window | null) => {
    if (contentWindow && user) {
      contentWindow.postMessage({
        type: 'STREAMHUB_AUTH',
        payload: {
          token: user.token,
          user: {
            email: user.email,
            name: user.name
          }
        }
      }, '*');
      console.log(`Successfully dispatched MFE auth message to iframe: ${iframeId}`);
    }
  };

  if (!authInitialized) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090c' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '3px dashed #e50914',
          animation: 'spinner 3s linear infinite'
        }} />
      </div>
    );
  }

  // Render Login screen if not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ minHeight: '100vh', margin: 0, padding: 0, position: 'relative' }}>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} userName={user.name} />
        
        {/* Render React Content (added top padding to avoid floating nav overlap) */}
        <div style={{ display: activeTab === 'home' ? 'block' : 'none' }}>
          <ContentDashboard />
        </div>
 
        {/* Render Vue Content via Web Component Custom Element */}
        {activeTab === 'browse' && (
          <div style={{ minHeight: '100vh', paddingTop: '100px', backgroundColor: '#09090c' }}>
            <MfeLoader 
              scriptUrl={VUE_MFE_URL} 
              customTagName="streamhub-browse"
            />
          </div>
        )}

        {/* Render Next.js Watchlist Content via iframe */}
        {activeTab === 'watchlist' && (
          <iframe 
            src={WATCHLIST_MFE_URL} 
            onLoad={(e) => handleIframeLoad('next-watchlist', (e.target as HTMLIFrameElement).contentWindow)}
            style={{ width: '100%', height: '100vh', border: 'none', paddingTop: '100px', background: '#0f0f13' }} 
            title="Next.js Watchlist App"
          />
        )}

        {/* Render Angular Content via iframe */}
        {activeTab === 'settings' && (
          <iframe 
            src={ANGULAR_MFE_URL} 
            onLoad={(e) => handleIframeLoad('angular-settings', (e.target as HTMLIFrameElement).contentWindow)}
            style={{ width: '100%', height: '100vh', border: 'none', paddingTop: '100px', background: '#0f0f13' }} 
            title="Angular Settings App"
          />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
