import { ref } from 'vue'
import { useLocalStorage } from './useLocalStorage'

// Structure of registrations: { eventId: [ { name, email, registeredAt } ] }
const registrations = useLocalStorage('event-registrations', {
  1: [
    { name: 'Олександр Куликов', email: 'kulykov@nure.ua', registeredAt: new Date(Date.now() - 3600000).toISOString() }
  ],
  2: [],
  3: []
})

export function useRegistration() {
  const isRegistering = ref(false)
  const registrationError = ref(null)

  const getParticipantsForEvent = (eventId) => {
    return registrations.value[eventId] || []
  }

  const registerForEvent = async (eventId, participantData) => {
    isRegistering.value = true
    registrationError.value = null

    // Store rollback state in case of failure
    const rollbackState = JSON.parse(JSON.stringify(registrations.value))

    // 1. Optimistic Update: Add participant immediately to UI
    if (!registrations.value[eventId]) {
      registrations.value[eventId] = []
    }
    
    const newParticipant = {
      name: participantData.name.trim(),
      email: participantData.email.trim(),
      registeredAt: new Date().toISOString()
    }
    
    registrations.value[eventId].push(newParticipant)

    // 2. Simulate Async Server request (1.5s delay)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 20% failure rate
        const isFailure = Math.random() < 0.20

        if (isFailure) {
          // Rollback to previous state
          registrations.value = rollbackState
          registrationError.value = 'Помилка мережі при спробі реєстрації. Спробуйте пізніше.'
          isRegistering.value = false
          reject(new Error('Network failure'))
        } else {
          isRegistering.value = false
          resolve(newParticipant)
        }
      }, 1500)
    })
  }

  return {
    isRegistering,
    registrationError,
    getParticipantsForEvent,
    registerForEvent
  }
}
