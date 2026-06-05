<template>
  <div class="view-container">
    <router-link to="/" class="back-link">
      &larr; Назад до списку
    </router-link>

    <div v-if="!task" class="error-detail-card">
      <span class="error-icon">🔍</span>
      <h2>Задача не знайдена</h2>
      <p>Задачу з ідентифікатором #{{ id }} не знайдено або її було видалено.</p>
      <router-link to="/" class="btn btn-primary">Повернутись до списку</router-link>
    </div>

    <article v-else class="detail-card">
      <header class="detail-header">
        <h1 class="detail-title">{{ task.title }}</h1>
        <div class="status-tags">
          <span class="tag-badge category-tag" :class="getCategoryClass(task.category)">
            Категорія: {{ task.category }}
          </span>
          <span class="tag-badge priority-tag" :class="getPriorityClass(task.priority)">
            Пріоритет: {{ task.priority }}
          </span>
        </div>
      </header>

      <section class="detail-info-grid">
        <!-- Status -->
        <div class="info-block">
          <span class="info-label">Статус</span>
          <div class="info-value">
            <span class="status-indicator" :class="{ 'completed': task.completed }">
              {{ task.completed ? 'Виконана' : 'Активна' }}
            </span>
            <button @click="store.toggleStatus(task.id)" class="btn btn-sm btn-status-toggle">
              Змінити статус
            </button>
          </div>
        </div>

        <!-- Category -->
        <div class="info-block">
          <span class="info-label">Категорія</span>
          <span class="info-value text-highlight">{{ task.category }}</span>
        </div>

        <!-- Deadline -->
        <div class="info-block">
          <span class="info-label">Дедлайн</span>
          <span class="info-value" :class="{ 'overdue-text': isOverdue }">
            {{ formatDate(task.deadline) }}
            <span v-if="isOverdue" class="overdue-badge">Прострочено</span>
          </span>
        </div>

        <!-- Created At -->
        <div class="info-block">
          <span class="info-label">Дата створення</span>
          <span class="info-value">{{ formatDateTime(task.createdAt) }}</span>
        </div>
      </section>

      <!-- Description Section -->
      <section class="detail-description">
        <span class="info-label">Опис завдання</span>
        <p v-if="task.description" class="description-text">{{ task.description }}</p>
        <p v-else class="description-text text-empty">Опис відсутній для цієї задачі.</p>
      </section>

      <!-- Card Actions -->
      <footer class="detail-actions">
        <router-link :to="'/tasks/' + task.id + '/edit'" class="btn btn-edit">
          Редагувати
        </router-link>
        <button @click="deleteTask" class="btn btn-delete">
          Видалити задачу
        </button>
      </footer>
    </article>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '../stores/taskStore'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const store = useTaskStore()
const router = useRouter()

// Find task
const task = computed(() => {
  return store.tasks.find(t => t.id === Number(props.id))
})

// Check if overdue
const isOverdue = computed(() => {
  if (!task.value || task.value.completed) return false
  const today = new Date().toISOString().split('T')[0]
  return task.value.deadline < today
})

// Delete action
const deleteTask = () => {
  if (confirm(`Ви впевнені, що хочете видалити задачу "${task.value.title}"?`)) {
    store.deleteTask(task.value.id)
    router.push('/')
  }
}

// Helpers
const getCategoryClass = (category) => {
  const map = {
    'Робота': 'tag-work',
    'Навчання': 'tag-education',
    'Особисте': 'tag-personal',
    'Інше': 'tag-other'
  }
  return map[category] || 'tag-other'
}

const getPriorityClass = (priority) => {
  const map = {
    'Високий': 'tag-high',
    'Середній': 'tag-medium',
    'Низький': 'tag-low'
  }
  return map[priority] || 'tag-low'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const parts = dateString.split('-')
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`
  }
  return dateString
}

const formatDateTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleString('uk-UA', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
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

/* Error Card */
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

/* Detail Card Design */
.detail-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 32px;
}

.detail-header {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 20px;
  margin-bottom: 24px;
}

.detail-title {
  font-size: 1.8rem;
  margin: 0 0 12px 0;
}

.status-tags {
  display: flex;
  gap: 10px;
}

.tag-badge {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
  text-transform: uppercase;
}

/* Category tags styling */
.tag-work { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
.tag-education { background: rgba(6, 182, 212, 0.15); color: #22d3ee; }
.tag-personal { background: rgba(168, 85, 247, 0.15); color: #c084fc; }
.tag-other { background: rgba(107, 114, 128, 0.15); color: #9ca3af; }

/* Priority tags styling */
.tag-high { background: rgba(239, 68, 68, 0.15); color: #f87171; }
.tag-medium { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
.tag-low { background: rgba(16, 185, 129, 0.15); color: #34d399; }

/* Detail Info Grid */
.detail-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 28px;
}

.info-block {
  background: #111827;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1.1rem;
  font-weight: 500;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.status-indicator {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
}

.status-indicator.completed {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.btn-status-toggle {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 4px 8px;
  font-size: 0.75rem;
  border-radius: 6px;
}

.btn-status-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.overdue-text {
  color: var(--danger-color) !important;
}

.overdue-badge {
  background: var(--danger-color);
  color: #fff;
  font-size: 0.75rem;
  padding: 1px 6px;
  border-radius: 4px;
}

/* Description text */
.detail-description {
  background: #111827;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.description-text {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-main);
  white-space: pre-line;
}

.text-empty {
  color: var(--text-muted);
  font-style: italic;
}

/* Actions */
.detail-actions {
  display: flex;
  gap: 12px;
  border-top: 1px solid var(--border-color);
  padding-top: 24px;
}

.btn-edit {
  background: var(--primary-gradient);
  color: #fff;
  border: none;
}

.btn-edit:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-delete {
  background: transparent;
  color: var(--danger-color);
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--danger-color);
}
</style>
