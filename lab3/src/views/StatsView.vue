<template>
  <div class="view-container">
    <header class="view-header">
      <h1 class="page-title">Статистика задач</h1>
    </header>

    <!-- Stat Cards Grid -->
    <section class="stats-grid">
      <div class="stat-card card-total">
        <span class="stat-number">{{ store.totalTasksCount }}</span>
        <span class="stat-label">Всього задач</span>
      </div>

      <div class="stat-card card-active">
        <span class="stat-number">{{ store.activeTasksCount }}</span>
        <span class="stat-label">Активних</span>
      </div>

      <div class="stat-card card-completed">
        <span class="stat-number">{{ store.completedTasksCount }}</span>
        <span class="stat-label">Виконано</span>
      </div>

      <div class="stat-card card-overdue" :class="{ 'has-overdue': store.overdueTasksCount > 0 }">
        <span class="stat-number">{{ store.overdueTasksCount }}</span>
        <span class="stat-label">Прострочено</span>
      </div>
    </section>

    <!-- Progress & Categories Section -->
    <section class="charts-section">
      <!-- Completion Progress Bar -->
      <div class="chart-block progress-block">
        <h2 class="section-subtitle">Прогрес виконання</h2>
        <div class="progress-details">
          <span class="progress-percent">{{ store.completionPercentage }}%</span>
          <span class="progress-ratio">
            {{ store.completedTasksCount }} з {{ store.totalTasksCount }} виконано
          </span>
        </div>
        <div class="progress-track">
          <div 
            class="progress-fill" 
            :style="{ width: store.completionPercentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- Category Distribution -->
      <div class="chart-block categories-block">
        <h2 class="section-subtitle">Розподіл за категоріями</h2>
        <div class="categories-list">
          <div 
            v-for="(count, category) in store.categoryCounts" 
            :key="category" 
            class="category-stat-row"
          >
            <span class="cat-name">{{ category }}</span>
            <div class="cat-bar-wrapper">
              <div 
                class="cat-bar-fill" 
                :class="getCategoryClass(category)"
                :style="{ width: (count / store.totalTasksCount * 100) + '%' }"
              ></div>
            </div>
            <span class="cat-count">{{ count }}</span>
          </div>
          <div v-if="Object.keys(store.categoryCounts).length === 0" class="empty-text">
            Немає задач для аналізу категорій.
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Deadlines -->
    <section class="deadlines-section">
      <h2 class="section-subtitle">Найближчі дедлайни (наступні 3 дні)</h2>
      
      <div v-if="store.upcomingTasks.length === 0" class="empty-deadlines">
        <span class="deadline-check-icon">✓</span>
        <p>Немає термінових задач на найближчі 3 дні. Гарна робота!</p>
      </div>

      <div v-else class="deadlines-list">
        <div 
          v-for="task in store.upcomingTasks" 
          :key="task.id" 
          class="deadline-row"
        >
          <div class="deadline-row-main">
            <span class="deadline-row-title">{{ task.title }}</span>
            <span class="deadline-row-cat">{{ task.category }}</span>
          </div>
          <span class="deadline-row-date">
            {{ formatDate(task.deadline) }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useTaskStore } from '../stores/taskStore'

const store = useTaskStore()

// Helpers (No business logic, pure UI helpers)
const formatDate = (dateString) => {
  if (!dateString) return ''
  const parts = dateString.split('-')
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`
  }
  return dateString
}

const getCategoryClass = (category) => {
  const map = {
    'Робота': 'bg-work',
    'Навчання': 'bg-education',
    'Особисте': 'bg-personal',
    'Інше': 'bg-other'
  }
  return map[category] || 'bg-other'
}
</script>

<style scoped>
.page-title {
  margin-top: 0;
  margin-bottom: 24px;
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.025em;
}

/* Accent border colors for cards */
.card-total { border-left: 4px solid var(--primary-color); }
.card-active { border-left: 4px solid var(--secondary-color); }
.card-completed { border-left: 4px solid #10b981; }
.card-overdue { border-left: 4px solid var(--text-muted); }
.card-overdue.has-overdue { 
  border-left: 4px solid var(--danger-color);
  background: rgba(239, 68, 68, 0.02);
}
.card-overdue.has-overdue .stat-number {
  color: var(--danger-color);
}

/* Charts section */
.charts-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

@media (min-width: 768px) {
  .charts-section {
    grid-template-columns: 1fr 1fr;
  }
}

.chart-block {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
}

.section-subtitle {
  font-size: 1.25rem;
  margin-top: 0;
  margin-bottom: 20px;
}

/* Progress bar */
.progress-details {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
}

.progress-percent {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
}

.progress-ratio {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.progress-track {
  height: 12px;
  background: #111827;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.progress-fill {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: 6px;
  transition: width 0.8s cubic-bezier(0.1, 0.8, 0.25, 1);
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
}

/* Category stats */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-stat-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cat-name {
  width: 80px;
  font-size: 0.95rem;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cat-bar-wrapper {
  flex-grow: 1;
  height: 8px;
  background: #111827;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.cat-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease;
}

/* Category fills mapping */
.bg-work { background: #818cf8; }
.bg-education { background: #22d3ee; }
.bg-personal { background: #c084fc; }
.bg-other { background: #9ca3af; }

.cat-count {
  width: 24px;
  text-align: right;
  font-weight: 600;
  font-size: 0.95rem;
  color: #fff;
}

.empty-text {
  color: var(--text-muted);
  font-style: italic;
  font-size: 0.95rem;
}

/* Upcoming deadlines */
.deadlines-section {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
}

.empty-deadlines {
  text-align: center;
  padding: 32px 0;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.deadline-check-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.deadlines-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.deadline-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #111827;
  border: 1px solid var(--border-color);
  padding: 12px 18px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.deadline-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.deadline-row-main {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.deadline-row-title {
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.deadline-row-cat {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 2px 6px;
  border-radius: 4px;
}

.deadline-row-date {
  font-size: 0.9rem;
  color: var(--danger-color);
  font-weight: 500;
}
</style>
