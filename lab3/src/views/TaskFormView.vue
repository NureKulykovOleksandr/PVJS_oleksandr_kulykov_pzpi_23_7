<template>
  <div class="view-container">
    <router-link :to="isEdit ? '/tasks/' + id : '/'" class="back-link">
      &larr; Скасувати та повернутись
    </router-link>

    <div class="form-card">
      <h1 class="page-title">{{ isEdit ? 'Редагувати задачу' : 'Створити нову задачу' }}</h1>

      <form @submit.prevent="handleSubmit" class="task-form">
        <!-- Title -->
        <div class="form-group">
          <label for="title" class="form-label">Назва задачі <span class="required">*</span></label>
          <input
            id="title"
            type="text"
            v-model="formData.title"
            placeholder="Введіть назву задачі..."
            class="form-input"
            :class="{ 'input-error': errors.title }"
          />
          <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="description" class="form-label">Опис завдання</label>
          <textarea
            id="description"
            v-model="formData.description"
            placeholder="Введіть опис або деталі завдання..."
            class="form-input form-textarea"
            rows="4"
          ></textarea>
        </div>

        <!-- Row for Category & Priority -->
        <div class="form-row">
          <div class="form-group col-half">
            <label for="category" class="form-label">Категорія</label>
            <select id="category" v-model="formData.category" class="form-select">
              <option value="Робота">Робота</option>
              <option value="Навчання">Навчання</option>
              <option value="Особисте">Особисте</option>
              <option value="Інше">Інше</option>
            </select>
          </div>

          <div class="form-group col-half">
            <label for="priority" class="form-label">Пріоритет</label>
            <select id="priority" v-model="formData.priority" class="form-select">
              <option value="Високий">Високий</option>
              <option value="Середній">Середній</option>
              <option value="Низький">Низький</option>
            </select>
          </div>
        </div>

        <!-- Row for Deadline & Status (only in edit mode) -->
        <div class="form-row">
          <div class="form-group" :class="isEdit ? 'col-half' : 'col-full'">
            <label for="deadline" class="form-label">Дедлайн <span class="required">*</span></label>
            <input
              id="deadline"
              type="date"
              v-model="formData.deadline"
              class="form-input"
              :class="{ 'input-error': errors.deadline }"
            />
            <span v-if="errors.deadline" class="error-message">{{ errors.deadline }}</span>
          </div>

          <div class="form-group col-half" v-if="isEdit">
            <label for="completed" class="form-label">Статус виконання</label>
            <select id="completed" v-model="formData.completed" class="form-select">
              <option :value="false">Активна</option>
              <option :value="true">Виконана</option>
            </select>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" @click="handleCancel" class="btn btn-cancel">
            Скасувати
          </button>
          <button type="submit" class="btn btn-primary btn-submit">
            {{ isEdit ? 'Зберегти зміни' : 'Створити задачу' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '../stores/taskStore'

const props = defineProps({
  id: {
    type: String,
    required: false
  }
})

const route = useRoute()
const router = useRouter()
const store = useTaskStore()

// Determine if we are in edit mode
const isEdit = computed(() => {
  return route.name === 'TaskEdit' && props.id !== undefined
})

// Form State
const formData = ref({
  title: '',
  description: '',
  category: 'Робота',
  priority: 'Середній',
  deadline: '',
  completed: false
})

const errors = ref({
  title: '',
  deadline: ''
})

// Check validation
const validateForm = () => {
  let isValid = true
  errors.value.title = ''
  errors.value.deadline = ''

  // Validate Title
  if (!formData.value.title.trim()) {
    errors.value.title = 'Назва задачі є обов’язковою'
    isValid = false
  }

  // Validate Deadline
  if (!formData.value.deadline) {
    errors.value.deadline = 'Вкажіть кінцеву дату дедлайну'
    isValid = false
  } else if (!isEdit.value) {
    // Check that deadline is in the future or today (only for new tasks)
    const todayStr = new Date().toISOString().split('T')[0]
    if (formData.value.deadline < todayStr) {
      errors.value.deadline = 'Дедлайн не може бути у минулому'
      isValid = false
    }
  }

  return isValid
}

// Load task info if editing
onMounted(() => {
  if (isEdit.value) {
    const task = store.tasks.find(t => t.id === Number(props.id))
    if (task) {
      formData.value = {
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        deadline: task.deadline,
        completed: task.completed
      }
    } else {
      // Task not found, redirect to list
      router.push('/')
    }
  } else {
    // Default deadline to tomorrow for new tasks
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
    formData.value.deadline = tomorrow
  }
})

// Handle Submit
const handleSubmit = () => {
  if (!validateForm()) return

  if (isEdit.value) {
    store.updateTask(props.id, formData.value)
    router.push(`/tasks/${props.id}`)
  } else {
    store.addTask(formData.value)
    router.push('/')
  }
}

// Handle Cancel
const handleCancel = () => {
  if (isEdit.value) {
    router.push(`/tasks/${props.id}`)
  } else {
    router.push('/')
  }
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

/* Form Card */
.form-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 32px;
  max-width: 700px;
  margin: 0 auto;
}

.page-title {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 1.6rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 16px;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.col-full {
  width: 100%;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 576px) {
  .form-row {
    flex-direction: row;
  }
  .col-half {
    flex: 1;
  }
}

.form-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-main);
}

.required {
  color: var(--danger-color);
}

.form-input, .form-select {
  background: #111827;
  border: 1px solid var(--border-color);
  color: var(--text-main);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.form-input:focus, .form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

.input-error {
  border-color: var(--danger-color);
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.error-message {
  color: var(--danger-color);
  font-size: 0.85rem;
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid var(--border-color);
  padding-top: 24px;
  margin-top: 12px;
}

.btn-submit {
  background: var(--primary-gradient);
  color: #fff;
  border: none;
}

.btn-submit:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-cancel {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-color);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
}
</style>
