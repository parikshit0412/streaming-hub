<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const categories = [
  {
    name: "Action & Adventure",
    movies: [
      { id: 101, title: "Cyber Heist", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "2h 10m", match: "98%" },
      { id: 102, title: "Neon City", poster: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4", duration: "1h 45m", match: "85%" },
      { id: 103, title: "Desert Storm", poster: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4", duration: "2h 05m", match: "91%" },
      { id: 104, title: "Arctic Pursuit", poster: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "1h 55m", match: "78%" },
    ]
  },
  {
    name: "Sci-Fi & Fantasy",
    movies: [
      { id: 201, title: "Beyond the Stars", poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4", duration: "2h 30m", match: "95%" },
      { id: 202, title: "The Martian Outpost", poster: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "1h 50m", match: "88%" },
      { id: 203, title: "Dragon's Lair", poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4", duration: "2h 15m", match: "92%" },
      { id: 204, title: "Neon Genesis", poster: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "1h 40m", match: "81%" },
    ]
  }
];

const activeVideo = ref<string | null>(null);
const currentUser = ref<{ email: string, name: string } | null>(null);
const authToken = ref<string | null>(null);
const isMfe = ref(false);

function playVideo(url: string) {
  activeVideo.value = url;
}

function closeVideo() {
  activeVideo.value = null;
}

const handleAuthMessage = (event: MessageEvent) => {
  if (event.data && event.data.type === 'STREAMHUB_AUTH') {
    const { token, user } = event.data.payload;
    authToken.value = token;
    currentUser.value = user;
    console.log("Vue Browse MFE: Successfully authenticated via Host!");
  }
};

onMounted(() => {
  isMfe.value = !!(window as any).__POWERED_BY_HOST__ || window.parent !== window;
  window.addEventListener('message', handleAuthMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleAuthMessage);
});
</script>

<template>
  <!-- Lock Screen for MFE if not logged in -->
  <div v-if="isMfe && !currentUser" class="lock-screen">
    <div class="lock-card">
      <div class="loader-glow-icon">🔒</div>
      <h2>Access Gated via Host</h2>
      <p>Verifying MFE credentials...</p>
    </div>
  </div>

  <div v-else class="vue-mfe-container">
    <!-- Standalone Banner -->
    <div v-if="!isMfe" class="standalone-banner">
      <span>ℹ️ Running MFE in <strong>Standalone Dev Mode</strong> (Auth Gating is bypassed for development).</span>
      <span class="standalone-port">URL: http://localhost:4201</span>
    </div>

    <div class="content">
      <h1 class="page-title">Discover Movies & Shows</h1>
      
      <div v-for="category in categories" :key="category.name" class="category-row">
        <h2 class="category-title">{{ category.name }}</h2>
        <div class="movie-grid">
          <div v-for="movie in category.movies" :key="movie.id" class="movie-card" @click="playVideo(movie.videoUrl)">
            <div class="poster-container" :style="{ backgroundImage: `url(${movie.poster})` }">
              <div class="overlay">
                <span class="play-btn">▶ Play</span>
              </div>
            </div>
            <div class="movie-info">
              <h3>{{ movie.title }}</h3>
              <div class="meta">
                <span class="match">{{ movie.match }} Match</span>
                <span>{{ movie.duration }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Modal -->
    <div v-if="activeVideo" class="video-modal">
      <!-- Floating Back Button -->
      <button class="close-btn-glowing" @click="closeVideo">
        ← Back to Gallery
      </button>
      <div class="video-container">
        <video controls autoplay class="video-player" :src="activeVideo"></video>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

.vue-mfe-container {
  font-family: 'Outfit', sans-serif;
  background-color: #0f0f13;
  color: white;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.content {
  padding: 1rem 4rem 3rem 4rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
}

.category-row {
  margin-bottom: 3rem;
}

.category-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.movie-card {
  background: rgba(30, 30, 35, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-card:hover {
  transform: scale(1.05) translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.poster-container {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover .overlay {
  opacity: 1;
}

.play-btn {
  background: rgba(229, 9, 20, 0.9);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
}

.movie-info {
  padding: 1.2rem;
}

.movie-info h3 {
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.meta {
  display: flex;
  justify-content: space-between;
  color: #9ca3af;
  font-size: 0.85rem;
}

.match {
  color: #4ade80;
  font-weight: 600;
}

.video-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.video-container {
  position: relative;
  width: 80%;
  max-width: 1200px;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
}

.video-player {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

/* Lock Screen */
.lock-screen {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #09090c;
  color: white;
  font-family: 'Outfit', sans-serif;
  text-align: center;
}
.lock-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 3rem;
  max-width: 400px;
  background: rgba(20, 20, 25, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.6);
  backdrop-filter: blur(25px);
}
.loader-glow-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(229, 9, 20, 0.05);
  border: 2px dashed #e50914;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  box-shadow: 0 0 25px rgba(229, 9, 20, 0.35);
  animation: spinner 3s linear infinite;
}
@keyframes spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.lock-card p {
  color: #a1a1aa;
  font-size: 0.9rem;
  margin: 0;
}

/* Standalone banner */
.standalone-banner {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 0.85rem;
  margin: 1rem 4rem 0 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.standalone-port {
  font-size: 0.75rem;
  opacity: 0.8;
}
.close-btn-glowing {
  position: absolute;
  top: 30px;
  left: 30px;
  background: rgba(20, 20, 25, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  padding: 0.7rem 1.4rem;
  border-radius: 30px;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
  z-index: 1010;
}
.close-btn-glowing:hover {
  background: linear-gradient(135deg, #e50914 0%, #ff3b47 100%);
  border-color: transparent;
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(229, 9, 20, 0.4);
}
</style>
