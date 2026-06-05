<template>
  <div class="image-card" :class="{ 'is-favorite': isFavorite }">
    <div class="image-wrapper">
      <!-- Loading Skeleton -->
      <div v-if="!imageLoaded" class="skeleton-loader"></div>
      
      <!-- Actual Image -->
      <img
        :src="image.download_url"
        :alt="'Photo by ' + image.author"
        @load="onImageLoad"
        :class="{ 'loaded': imageLoaded }"
        loading="lazy"
      />
      
      <!-- Favorites Overlay Button -->
      <button 
        class="fav-btn" 
        :class="{ 'active': isFavorite }" 
        @click.stop="$emit('toggle-favorite', image.id)"
        aria-label="Add to favorites"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      </button>
    </div>
    
    <div class="image-info">
      <h3 class="author-name">{{ image.author }}</h3>
      <div class="image-meta">
        <span class="image-id">#{{ image.id }}</span>
        <span class="image-dims">{{ image.width }} × {{ image.height }}</span>
      </div>
      <div class="card-actions">
        <a 
          :href="image.url" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="action-link view-source"
        >
          View Source
        </a>
        <a 
          :href="image.download_url" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="action-link download-btn"
        >
          Download
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  image: {
    type: Object,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-favorite'])

const imageLoaded = ref(false)

const onImageLoad = () => {
  imageLoaded.value = true
}
</script>

<style scoped>
.image-card {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.image-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px var(--primary-glow);
  border-color: var(--primary-color);
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 62.5%; /* 16:10 Aspect Ratio */
  overflow: hidden;
  background: var(--skeleton-bg);
}

.image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.image-wrapper img.loaded {
  opacity: 1;
}

.image-card:hover .image-wrapper img {
  transform: scale(1.05);
}

.skeleton-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--skeleton-bg) 25%, var(--skeleton-pulse) 50%, var(--skeleton-bg) 75%);
  background-size: 200% 100%;
  animation: loading-pulse 1.5s infinite;
}

@keyframes loading-pulse {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.fav-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fav-btn svg {
  fill: rgba(255, 255, 255, 0.5);
  transition: fill 0.3s ease, transform 0.3s ease;
}

.fav-btn:hover {
  transform: scale(1.1);
  background: rgba(15, 23, 42, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
}

.fav-btn:hover svg {
  fill: rgba(255, 255, 255, 0.8);
}

.fav-btn.active {
  background: var(--fav-glow);
  border-color: var(--favorite-color);
}

.fav-btn.active svg {
  fill: var(--favorite-color);
  filter: drop-shadow(0 0 6px var(--favorite-color));
  transform: scale(1.1) rotate(72deg);
}

.image-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.author-name {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.image-id {
  background: var(--badge-bg);
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.action-link {
  flex: 1;
  text-align: center;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.view-source {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-color);
}

.view-source:hover {
  color: var(--text-main);
  border-color: var(--text-muted);
  background: rgba(255, 255, 255, 0.05);
}

.download-btn {
  background: var(--primary-gradient);
  color: #fff;
  border: none;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.download-btn:hover {
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
  transform: translateY(-1px);
}
</style>
