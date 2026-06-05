<template>
  <div class="view-container">
    <router-link :to="'/events/' + id" class="back-link">
      &larr; Назад до детального опису
    </router-link>

    <div v-if="!event" class="error-detail-card">
      <span class="error-icon">🔍</span>
      <h2>Подію не знайдено</h2>
      <p>Подію з ідентифікатором #{{ id }} не знайдено.</p>
      <router-link to="/" class="btn btn-primary">Повернутись до списку</router-link>
    </div>

    <div v-else class="form-card">
      <h1 class="page-title">Реєстрація на захід</h1>
      <div class="event-brief">
        <span class="brief-label">Ви обрали подію:</span>
        <h3 class="brief-title" :style="{ color: getGradientColor }">{{ event.title }}</h3>
        <p class="brief-date">Дата проведення: {{ formatDate(event.date) }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="registration-form">
        <!-- Name -->
        <div class="form-group">
          <label for="name" class="form-label">Ваше ім'я та прізвище <span class="required">*</span></label>
          <input 
            id="name"
            type="text" 
            v-model="formData.name" 
            placeholder="Введіть ваше ім'я..."
            class="form-input"
            :class="{ 'input-error': errors.name }"
            :disabled="isRegistering"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label">Електронна пошта <span class="required">*</span></label>
          <input 
            id="email"
            type="email" 
            v-model="formData.email" 
            placeholder="yourname@domain.com"
            class="form-input"
            :class="{ 'input-error': errors.email }"
            :disabled="isRegistering"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <!-- Submit Buttons -->
        <div class="form-actions">
          <router-link :to="'/events/' + event.id" class="btn btn-cancel" :disabled="isRegistering">
            Скасувати
          </router-link>
          <button type="submit" class="btn btn-primary btn-submit" :disabled="isRegistering">
            <span v-if="isRegistering" class="btn-spinner"></span>
            {{ isRegistering ? 'Надсилання...' : 'Зареєструватися' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Modals Teleported to Body -->
    <Modal
      :show="modal.show"
      :type="modal.type"
      :title="modal.title"
      :message="modal.message"
      @close="handleModalClose"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEvents } from '../composables/useEvents'
import { useRegistration } from '../composables/useRegistration'
import Modal from '../components/Modal.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()
const { getEventById } = useEvents()
const { registerForEvent, isRegistering } = useRegistration()

const event = computed(() => getEventById(props.id))

const getGradientColor = computed(() => {
  if (!event.value) return '#fff'
  // Return the first color from gradient or just let it color the text nicely
  return '#a78bfa'
})

// Form State
const formData = ref({
  name: '',
  email: ''
})

const errors = ref({
  name: '',
  email: ''
})

// Modal State
const modal = ref({
  show: false,
  type: 'info',
  title: '',
  message: ''
})

const validateForm = () => {
  let isValid = true
  errors.value.name = ''
  errors.value.email = ''

  if (!formData.value.name.trim()) {
    errors.value.name = "Ім'я є обов'язковим для заповнення"
    isValid = false
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.email.trim()) {
    errors.value.email = 'Вкажіть вашу електронну адресу'
    isValid = false
  } else if (!emailPattern.test(formData.value.email)) {
    errors.value.email = 'Некоректний формат електронної адреси'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    // Call registration (optimistically updates state, delays 1.5s, then resolves or rolls back)
    await registerForEvent(props.id, formData.value)
    
    // Show success modal
    modal.value = {
      show: true,
      type: 'success',
      title: 'Успішна реєстрація!',
      message: `Вітаємо, ${formData.value.name}! Ви успішно зареєструвалися на подію "${event.value.title}". Підтвердження надіслано на ${formData.value.email}.`
    }
  } catch (err) {
    // Show error modal
    modal.value = {
      show: true,
      type: 'error',
      title: 'Помилка реєстрації',
      message: 'Виникла помилка під час спроби реєстрації. Ваші локальні дані були відкочені. Спробуйте ще раз.'
    }
  }
}

const handleModalClose = () => {
  modal.value.show = false
  if (modal.value.type === 'success') {
    // Redirect back to event details page upon successful registration
    router.push(`/events/${props.id}`)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const parts = dateString.split('-')
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`
  }
  return dateString
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

/* Form Card */
.form-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  margin: 0 auto;
}

.page-title {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.6rem;
}

.event-brief {
  background: #111827;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 28px;
}

.brief-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  display: block;
  margin-bottom: 4px;
}

.brief-title {
  margin: 0 0 6px 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.brief-date {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-main);
}

.required {
  color: var(--danger-color);
}

.form-input {
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

.form-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-error {
  border-color: var(--danger-color);
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.15);
}

.error-message {
  color: var(--danger-color);
  font-size: 0.85rem;
}

/* Actions */
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
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-cancel {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-color);
}

.btn-cancel:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
}

/* Spinner inside button */
.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-left-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
