<template>
  <div class="app-container">
    <header class="app-header">
      <div class="logo-area">
        <span class="logo-icon">✨</span>
        <h1 class="app-title">Picsum Photo Gallery</h1>
      </div>
      <p class="app-subtitle">A curated feed of high-quality photos fetched dynamically via Picsum API</p>
    </header>

    <main class="main-content">
      <!-- Controls Panel (Search, Filter, Limits) -->
      <section class="controls-panel">
        <div class="search-box">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search photos by author..." 
            class="search-input"
          />
        </div>

        <div class="filters-and-limit">
          <div class="tab-filters">
            <button 
              class="filter-tab" 
              :class="{ 'active': currentFilter === 'all' }" 
              @click="setFilter('all')"
            >
              All Photos
            </button>
            <button 
              class="filter-tab" 
              :class="{ 'active': currentFilter === 'favorites' }" 
              @click="setFilter('favorites')"
            >
              Favorites
              <span class="fav-count" v-if="favorites.length">{{ favorites.length }}</span>
            </button>
          </div>

          <div class="limit-selector" v-if="currentFilter === 'all'">
            <label for="limit">Per page:</label>
            <select id="limit" v-model="limit" @change="onLimitChange" class="select-input">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p class="loading-text">Fetching amazing photos...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-card">
          <span class="error-icon">⚠️</span>
          <h2 class="error-title">Failed to load gallery</h2>
          <p class="error-msg">{{ error }}</p>
          <button @click="retryFetch" class="btn btn-retry">Try Again</button>
        </div>
      </div>

      <!-- Gallery Grid -->
      <section v-else class="gallery-section">
        <div v-if="filteredImages.length === 0" class="empty-state">
          <span class="empty-icon">📂</span>
          <h3>No photos found</h3>
          <p v-if="searchQuery">Try adjusting your search query or clear the filter.</p>
          <p v-else-if="currentFilter === 'favorites'">You haven't favorited any photos yet. Click the star on any card to add it here!</p>
        </div>
        
        <div v-else class="gallery-grid">
          <ImageCard
            v-for="img in filteredImages"
            :key="img.id"
            :image="img"
            :is-favorite="isImageFavorite(img.id)"
            @toggle-favorite="toggleFavorite(img)"
          />
        </div>
      </section>

      <!-- Pagination Footer -->
      <footer class="pagination-footer" v-if="!isLoading && !error && currentFilter === 'all' && filteredImages.length > 0">
        <button 
          class="btn btn-page" 
          :disabled="currentPage === 1" 
          @click="changePage(-1)"
        >
          &larr; Previous
        </button>
        <span class="page-indicator">Page {{ currentPage }}</span>
        <button 
          class="btn btn-page" 
          @click="changePage(1)"
        >
          Next &rarr;
        </button>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ImageCard from './components/ImageCard.vue'

// Reactive state
const images = ref([])
const isLoading = ref(false)
const error = ref(null)
const favorites = ref([])
const searchQuery = ref('')
const currentFilter = ref('all')
const currentPage = ref(1)
const limit = ref(20)

// Check if image is favorited
const isImageFavorite = (id) => {
  return favorites.value.some(fav => fav.id === id)
}

// Set active tab filter
const setFilter = (type) => {
  currentFilter.value = type
}

// Fetch images from Picsum API
const fetchImages = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(`https://picsum.photos/v2/list?page=${currentPage.value}&limit=${limit.value}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    images.value = data
  } catch (err) {
    error.value = err.message || 'Something went wrong while fetching data.'
    console.error('API Fetch Error:', err)
  } finally {
    isLoading.value = false
  }
}

// Toggle favorites state
const toggleFavorite = (image) => {
  const index = favorites.value.findIndex(fav => fav.id === image.id)
  if (index === -1) {
    favorites.value.push(image)
  } else {
    favorites.value.splice(index, 1)
  }
  localStorage.setItem('gallery-favorites', JSON.stringify(favorites.value))
}

// Page controls
const changePage = (direction) => {
  currentPage.value += direction
  if (currentPage.value < 1) currentPage.value = 1
  fetchImages()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Limit change handler
const onLimitChange = () => {
  currentPage.value = 1
  fetchImages()
}

// Retry fetch
const retryFetch = () => {
  fetchImages()
}

// Computed filtered list
const filteredImages = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  let list = []
  if (currentFilter.value === 'all') {
    list = images.value
  } else {
    list = favorites.value
  }

  if (query) {
    list = list.filter(img => img.author.toLowerCase().includes(query))
  }
  return list
})

// Load favorites on mount
onMounted(() => {
  const storedFavorites = localStorage.getItem('gallery-favorites')
  if (storedFavorites) {
    try {
      favorites.value = JSON.parse(storedFavorites)
    } catch (e) {
      favorites.value = []
    }
  }
  fetchImages()
})
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  padding: 48px 24px 24px 24px;
  text-align: center;
  background: radial-gradient(circle at top, rgba(99, 102, 241, 0.1) 0%, transparent 60%);
  border-bottom: 1px solid var(--border-color);
}

.logo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.logo-icon {
  font-size: 2.2rem;
  animation: float-logo 4s ease-in-out infinite;
}

@keyframes float-logo {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.app-title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.app-subtitle {
  margin: 0;
  color: var(--text-muted);
  font-size: 1.1rem;
}

.main-content {
  flex-grow: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
  box-sizing: border-box;
}

/* Controls section styling */
.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

@media (min-width: 768px) {
  .controls-panel {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.search-box {
  position: relative;
  flex-grow: 1;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px 14px 48px;
  background: rgba(18, 24, 38, 0.6);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-main);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px var(--primary-glow);
}

.filters-and-limit {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
}

.tab-filters {
  display: flex;
  background: #111827;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.filter-tab {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-tab:hover {
  color: var(--text-main);
}

.filter-tab.active {
  background: var(--card-bg);
  color: #fff;
  border: 1px solid var(--border-color);
}

.fav-count {
  background: var(--favorite-color);
  color: #000;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
}

.limit-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: var(--text-muted);
}

.select-input {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  font-size: 0.95rem;
}

.select-input:focus {
  border-color: var(--primary-color);
}

/* Spinner */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(99, 102, 241, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: var(--text-muted);
  font-size: 1.05rem;
}

/* Error design */
.error-container {
  padding: 40px 0;
  display: flex;
  justify-content: center;
}

.error-card {
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.error-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 12px;
}

.error-title {
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  color: var(--danger-color);
}

.error-msg {
  color: var(--text-muted);
  margin-bottom: 24px;
  font-size: 0.95rem;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn-retry {
  background: var(--danger-color);
  color: #fff;
  border: none;
}

.btn-retry:hover {
  background: #dc2626;
}

/* Gallery layout */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: var(--card-bg);
  border-radius: 16px;
  border: 1px dashed var(--border-color);
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 1.3rem;
}

.empty-state p {
  color: var(--text-muted);
  max-width: 400px;
  margin: 0 auto;
  font-size: 0.95rem;
}

/* Pagination */
.pagination-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.btn-page {
  background: var(--card-bg);
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.btn-page:hover:not(:disabled) {
  background: var(--border-color);
  border-color: var(--text-muted);
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-indicator {
  font-weight: 500;
  font-size: 1.05rem;
}
</style>
