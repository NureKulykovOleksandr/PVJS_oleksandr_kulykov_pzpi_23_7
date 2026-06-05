<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="modal-backdrop" @click="$emit('close')">
        <div class="modal-container" @click.stop :class="'modal-' + type">
          <header class="modal-header">
            <span class="modal-icon">{{ getIcon }}</span>
            <h3 class="modal-title">{{ title }}</h3>
          </header>
          
          <div class="modal-body">
            <p>{{ message }}</p>
          </div>
          
          <footer class="modal-footer">
            <button class="btn btn-modal-close" @click="$emit('close')">
              Закрити
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info' // success, error, info
  }
})

defineEmits(['close'])

const getIcon = computed(() => {
  if (props.type === 'success') return '✅'
  if (props.type === 'error') return '❌'
  return 'ℹ️'
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(9, 13, 22, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  background: #111726;
  border-radius: 16px;
  border: 1px solid #1e293b;
  width: 90%;
  max-width: 450px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  transform: scale(1);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.modal-icon {
  font-size: 1.8rem;
}

.modal-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #fff;
}

.modal-body {
  color: #9ca3af;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-modal-close {
  background: #1e293b;
  color: #f3f4f6;
  border: 1px solid #334155;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-modal-close:hover {
  background: #334155;
  color: #fff;
}

/* Modal Variant Colors */
.modal-success {
  border-left: 4px solid #10b981;
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.1), 0 20px 40px rgba(0, 0, 0, 0.4);
}

.modal-error {
  border-left: 4px solid #f43f5e;
  box-shadow: 0 0 30px rgba(244, 63, 94, 0.1), 0 20px 40px rgba(0, 0, 0, 0.4);
}

/* Transition Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container {
  transform: scale(0.9);
}

.modal-fade-leave-active .modal-container {
  transform: scale(0.95);
}
</style>
