<template>
  <div class="view-container">
    <header class="view-header">
      <h1 class="page-title">Менеджер задач</h1>
      <router-link to="/tasks/new" class="btn btn-primary btn-add-task">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        Додати задачу
      </router-link>
    </header>

    <!-- Filter & Sort controls -->
    <section class="filters-bar">
      <div class="search-wrapper">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Пошук за назвою..." 
          class="form-input search-input"
        />
      </div>
      
      <div class="selectors-wrapper">
        <select v-model="filterCategory" class="form-select">
          <option value="all">Усі категорії</option>
          <option value="Робота">Робота</option>
          <option value="Навчання">Навчання</option>
          <option value="Особисте">Особисте</option>
          <option value="Інше">Інше</option>
        </select>

        <select v-model="filterPriority" class="form-select">
          <option value="all">Усі пріоритети</option>
          <option value="Високий">Високий</option>
          <option value="Середній">Середній</option>
          <option value="Низький">Низький</option>
        </select>

        <select v-model="sortBy" class="form-select">
          <option value="deadline-asc">Сортування: дедлайн &uarr;</option>
          <option value="deadline-desc">Сортування: дедлайн &darr;</option>
          <option value="priority-desc">Сортування: пріоритет &darr;</option>
          <option value="priority-asc">Сортування: пріоритет &uarr;</option>
        </select>
      </div>
    </section>

    <!-- Task List -->
    <section class="tasks-section">
      <div v-if="filteredTasks.length === 0" class="empty-tasks-state">
        <span class="empty-icon">📝</span>
        <h3>Задач не знайдено</h3>
        <p>Спробуйте змінити параметри пошуку або додайте нову задачу.</p>
      </div>

      <div v-else class="tasks-list">
        <div 
          v-for="task in filteredTasks" 
          :key="task.id" 
          class="task-row"
          :class="{ 'is-completed': task.completed, 'is-overdue': isOverdue(task) }"
        >
          <!-- Complete Checkbox -->
          <button 
            class="status-toggle-btn" 
            @click="store.toggleStatus(task.id)"
            aria-label="Toggle completion status"
          >
            <div class="checkbox-circle" :class="{ 'checked': task.completed }">
              <svg v-if="task.completed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
          </button>

          <!-- Task Main details -->
          <div class="task-details-col">
            <h3 class="task-row-title">{{ task.title }}</h3>
            <div class="task-row-tags">
              <span class="tag-badge category-tag" :class="getCategoryClass(task.category)">
                {{ task.category }}
              </span>
              <span class="tag-badge priority-tag" :class="getPriorityClass(task.priority)">
                {{ task.priority }}
              </span>
              <span class="task-row-deadline" :class="{ 'overdue-text': isOverdue(task) }">
                <span v-if="isOverdue(task)">прострочено: </span>
                <span v-else>до </span>
                {{ formatDate(task.deadline) }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="task-row-actions">
            <router-link 
              :to="'/tasks/' + task.id + '/edit'" 
              class="action-icon-btn btn-edit" 
              title="Редагувати"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </router-link>
            
            <router-link 
              :to="'/tasks/' + task.id" 
              class="action-icon-btn btn-view" 
              title="Деталі"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </router-link>

            <button 
              @click="confirmDelete(task.id, task.title)" 
              class="action-icon-btn btn-delete" 
              title="Видалити"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'

const store = useTaskStore()

// Local filter states
const searchQuery = ref('')
const filterCategory = ref('all')
const filterPriority = ref('all')
const sortBy = ref('deadline-asc')

// Check if task is overdue
const isOverdue = (task) => {
  if (task.completed) return false
  const today = new Date().toISOString().split('T')[0]
  return task.deadline < today
}

// Format date for Ukrainian localization
const formatDate = (dateString) => {
  if (!dateString) return ''
  const parts = dateString.split('-')
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`
  }
  return dateString
}

// CSS Classes mapping
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

// Confirm and delete task
const confirmDelete = (id, title) => {
  if (confirm(`Ви впевнені, що хочете видалити задачу "${title}"?`)) {
    store.deleteTask(id)
  }
}

// Priority sorting value mapping
const priorityWeight = {
  'Високий': 3,
  'Середній': 2,
  'Низький': 1
}

// Computed filtered & sorted tasks
const filteredTasks = computed(() => {
  let list = [...store.tasks]
  
  // 1. Filter by search query
  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    list = list.filter(t => 
      t.title.toLowerCase().includes(query) || 
      t.description.toLowerCase().includes(query)
    )
  }

  // 2. Filter by Category
  if (filterCategory.value !== 'all') {
    list = list.filter(t => t.category === filterCategory.value)
  }

  // 3. Filter by Priority
  if (filterPriority.value !== 'all') {
    list = list.filter(t => t.priority === filterPriority.value)
  }

  // 4. Sort
  list.sort((a, b) => {
    if (sortBy.value === 'deadline-asc') {
      return a.deadline.localeCompare(b.deadline)
    } else if (sortBy.value === 'deadline-desc') {
      return b.deadline.localeCompare(a.deadline)
    } else if (sortBy.value === 'priority-desc') {
      return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
    } else if (sortBy.value === 'priority-asc') {
      return (priorityWeight[a.priority] || 0) - (priorityWeight[b.priority] || 0)
    }
    return 0
  })

  return list
})
</script>

<style scoped>
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.btn-add-task {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Filters bar design */
.filters-bar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 28px;
}

@media (min-width: 768px) {
  .filters-bar {
    flex-direction: row;
    align-items: center;
  }
}

.search-wrapper {
  flex-grow: 1;
}

.selectors-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.form-input, .form-select {
  background: #111827;
  border: 1px solid var(--border-color);
  color: var(--text-main);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus, .form-select:focus {
  border-color: var(--primary-color);
}

/* Task row design */
.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-row {
  display: flex;
  align-items: center;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 16px 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
  gap: 16px;
}

.task-row:hover {
  transform: translateX(4px);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.task-row.is-completed {
  opacity: 0.6;
}

.task-row.is-overdue {
  border-color: rgba(239, 68, 68, 0.3);
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.02) 0%, transparent 100%);
}

/* Status checkbox custom styling */
.status-toggle-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  transition: all 0.3s ease;
}

.checkbox-circle:hover {
  border-color: var(--primary-color);
  transform: scale(1.05);
}

.checkbox-circle.checked {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #fff;
}

/* Details column */
.task-details-col {
  flex-grow: 1;
  min-width: 0; /* allows text truncation */
}

.task-row-title {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: #fff;
  transition: color 0.3s ease;
}

.is-completed .task-row-title {
  text-decoration: line-through;
  color: var(--text-muted);
}

.task-row-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.tag-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
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

.task-row-deadline {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-left: 8px;
}

.overdue-text {
  color: var(--danger-color);
  font-weight: 500;
}

/* Actions column styling */
.task-row-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-icon-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.action-icon-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.btn-edit:hover {
  color: var(--secondary-color);
}

.btn-view:hover {
  color: var(--primary-color);
}

.btn-delete:hover {
  color: var(--danger-color);
  background: rgba(239, 68, 68, 0.1);
}

/* Empty State */
.empty-tasks-state {
  text-align: center;
  background: var(--card-bg);
  border: 1px dashed var(--border-color);
  border-radius: 12px;
  padding: 48px 24px;
}

.empty-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 12px;
}

.empty-tasks-state h3 {
  margin: 0 0 6px 0;
  font-size: 1.25rem;
}

.empty-tasks-state p {
  color: var(--text-muted);
  margin: 0;
  font-size: 0.95rem;
}
</style>
