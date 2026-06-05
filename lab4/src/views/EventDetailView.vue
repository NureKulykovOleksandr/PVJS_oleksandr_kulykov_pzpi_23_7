<template>
  <div class="view-container">
    <router-link to="/" class="back-link">
      &larr; Назад
    </router-link>

    <div v-if="!event" class="error-detail-card">
      <span class="error-icon">🔍</span>
      <h2>Подію не знайдено</h2>
      <p>Подію з ідентифікатором #{{ id }} не знайдено.</p>
      <router-link to="/" class="btn btn-primary">Повернутись до списку</router-link>
    </div>

    <div v-else class="event-detail-layout">
      <!-- Main Event Card -->
      <article class="detail-card-layout">
        <!-- Visual Banner Side -->
        <div class="detail-visual" :style="{ background: event.gradient }">
          <div class="visual-badge">{{ event.category }}</div>
          <h1 class="visual-title">{{ event.title }}</h1>
          <p class="visual-tagline">Подія для IT-спільноти</p>
        </div>

        <!-- Details Info Side -->
        <div class="detail-info">
          <h2 class="event-detail-title">{{ event.title }}</h2>
          
          <div class="detail-meta-list">
            <div class="meta-item">
              <span class="meta-label">Категорія:</span>
              <span class="meta-value text-purple">{{ event.category }}</span>
            </div>
            
            <div class="meta-item">
              <span class="meta-label">Дата:</span>
              <span class="meta-value">{{ formatDate(event.date) }}</span>
            </div>

            <div class="meta-item">
              <span class="meta-label">Місце проведення:</span>
              <span class="meta-value">{{ event.location }}</span>
            </div>
          </div>

          <div class="detail-description">
            <span class="desc-label">Про захід</span>
            <p>{{ event.description }}</p>
          </div>

          <router-link :to="'/events/' + event.id + '/register'" class="btn btn-primary btn-register-cta">
            Зареєструватися &rarr;
          </router-link>
        </div>
      </article>

      <!-- Registered Participants Section -->
      <section class="participants-section">
        <h2 class="section-title-label">Зареєстровані учасники</h2>
        
        <div v-if="participants.length === 0" class="empty-participants">
          <p class="empty-p-msg">Поки що ніхто не зареєструвався. Будь першим!</p>
        </div>
        
        <div v-else class="participants-list">
          <div 
            v-for="(p, index) in participants" 
            :key="p.email" 
            class="participant-row"
          >
            <div class="p-avatar">
              {{ p.name.charAt(0).toUpperCase() }}
            </div>
            <div class="p-info">
              <h4 class="p-name">{{ p.name }}</h4>
              <p class="p-email">{{ p.email }}</p>
            </div>
            <div class="p-time">
              Зареєстровано: {{ formatTime(p.registeredAt) }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEvents } from '../composables/useEvents'
import { useRegistration } from '../composables/useRegistration'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const { getEventById } = useEvents()
const { getParticipantsForEvent } = useRegistration()

const event = computed(() => getEventById(props.id))
const participants = computed(() => getParticipantsForEvent(props.id))

const formatDate = (dateString) => {
  if (!dateString) return ''
  const parts = dateString.split('-')
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`
  }
  return dateString
}

const formatTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 24px;
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: var(--primary-color);
}

/* Error detail card */
.error-detail-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 48px;
  text-align: center;
  border-radius: 16px;
}

.error-detail-card h2 {
  margin: 0 0 12px 0;
  color: var(--danger-color);
}

.error-detail-card p {
  color: var(--text-muted);
  margin-bottom: 24px;
}

/* Event Detail layout split */
.event-detail-layout {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.detail-card-layout {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .detail-card-layout {
    flex-direction: row;
  }
}

.detail-visual {
  flex: 1;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: #fff;
  min-height: 250px;
}

@media (min-width: 768px) {
  .detail-visual {
    max-width: 320px;
    min-height: auto;
  }
}

.visual-badge {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  align-self: flex-start;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.visual-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
}

.visual-tagline {
  margin: 8px 0 0 0;
  opacity: 0.7;
  font-size: 0.9rem;
}

.detail-info {
  flex: 2;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.event-detail-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.detail-meta-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.meta-item {
  display: flex;
  gap: 8px;
  font-size: 0.95rem;
}

.meta-label {
  color: var(--text-muted);
  font-weight: 500;
}

.meta-value {
  color: #fff;
  font-weight: 600;
}

.text-purple {
  color: #a78bfa;
}

.detail-description {
  margin-bottom: 32px;
}

.desc-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.detail-description p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
  font-size: 1rem;
}

.btn-register-cta {
  width: 100%;
  padding: 14px 20px;
  font-size: 1.05rem;
  font-weight: 600;
}

/* Participants list design */
.participants-section {
  border-top: 1px solid var(--border-color);
  padding-top: 32px;
}

.section-title-label {
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 20px;
}

.empty-participants {
  background: var(--card-bg);
  border: 1px dashed var(--border-color);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  color: var(--text-muted);
}

.empty-p-msg {
  margin: 0;
  font-style: italic;
  font-size: 0.95rem;
}

.participants-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.participant-row {
  display: flex;
  align-items: center;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 14px 20px;
  border-radius: 12px;
  gap: 16px;
  transition: transform 0.3s ease;
}

.participant-row:hover {
  transform: translateX(2px);
  border-color: rgba(255, 255, 255, 0.1);
}

.p-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-gradient);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.p-info {
  flex-grow: 1;
  min-width: 0;
}

.p-name {
  margin: 0 0 2px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.p-email {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.p-time {
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
