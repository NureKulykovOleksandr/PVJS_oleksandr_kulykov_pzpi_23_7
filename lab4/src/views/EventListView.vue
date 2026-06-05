<template>
  <div class="view-container">
    <header class="view-header">
      <h1 class="page-title">Події</h1>
      <span class="view-subtitle">Список доступних IT-заходів та реєстрація на них</span>
    </header>

    <!-- Filter/Search Bar -->
    <section class="search-section">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Пошук подій за назвою..." 
          class="form-input search-input"
        />
      </div>
    </section>

    <!-- Events Grid -->
    <section class="events-grid">
      <div 
        v-for="event in filteredEvents" 
        :key="event.id" 
        class="event-card"
      >
        <!-- Card Header with Gradient -->
        <div class="event-card-banner" :style="{ background: event.gradient }">
          <h2 class="banner-title">{{ event.title }}</h2>
          <p class="banner-tagline">{{ event.category }}</p>
        </div>

        <!-- Card Content -->
        <div class="event-card-body">
          <div class="event-meta">
            <span class="meta-badge">{{ event.category }}</span>
            <span class="meta-date">{{ formatDate(event.date) }}</span>
          </div>

          <h3 class="event-title">{{ event.title }}</h3>
          <p class="event-desc">{{ truncateText(event.description, 100) }}</p>

          <!-- Action Buttons -->
          <div class="event-actions">
            <router-link :to="'/events/' + event.id" class="btn btn-secondary">
              Деталі
            </router-link>
            <router-link :to="'/events/' + event.id + '/register'" class="btn btn-primary btn-reg">
              Реєстрація
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEvents } from '../composables/useEvents'

const { events } = useEvents()
const searchQuery = ref('')

const truncateText = (text, limit) => {
  if (text.length <= limit) return text
  return text.substring(0, limit) + '...'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const parts = dateString.split('-')
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`
  }
  return dateString
}

const filteredEvents = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return events.value
  return events.value.filter(e => e.title.toLowerCase().includes(query))
})
</script>

<style scoped>
.view-header {
  margin-bottom: 28px;
}

.view-subtitle {
  color: var(--text-muted);
  font-size: 1rem;
}

.search-section {
  margin-bottom: 32px;
  max-width: 500px;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
}

/* Event cards layout */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
}

.event-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
}

.event-card:hover {
  transform: translateY(-6px);
  border-color: rgba(124, 58, 237, 0.35);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.event-card-banner {
  padding: 32px 24px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: #fff;
  position: relative;
}

.banner-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.banner-tagline {
  margin: 4px 0 0 0;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  opacity: 0.8;
  text-transform: uppercase;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.event-card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.event-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.meta-badge {
  font-size: 0.7rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  padding: 2px 8px;
  border-radius: 4px;
  color: var(--text-muted);
}

.meta-date {
  font-size: 0.85rem;
  color: #fb7185; /* Soft rose red */
  font-weight: 600;
}

.event-title {
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
}

.event-desc {
  margin: 0 0 24px 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-muted);
}

.event-actions {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

.event-actions .btn {
  flex: 1;
}

.btn-reg {
  box-shadow: none;
}
</style>
