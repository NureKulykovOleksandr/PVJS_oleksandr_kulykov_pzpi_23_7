import { ref } from 'vue'

const initialEvents = [
  {
    id: 1,
    title: 'Vue Meetup',
    description: 'Зустріч Vue-розробників у дружній атмосфері. Доповіді, нетворкінг і закуски. Обговорення нововведень у Vue 3.5 та практичних паттернів використання Composition API.',
    category: 'МІТАП',
    date: '2026-05-01',
    location: 'Київ, вул. Хрещатик 22',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)'
  },
  {
    id: 2,
    title: 'Frontend Conf',
    description: 'Повний день доповідей про продуктивність, доступність і сучасні інструменти фронтенду. Провідні розробники розкажуть про оптимізацію вебзастосунків та новітні CSS-технології.',
    category: 'КОНФЕРЕНЦІЯ',
    date: '2026-06-12',
    location: 'Львів, вул. Зелена 12',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)'
  },
  {
    id: 3,
    title: 'Hackathon',
    description: '48 годин, щоб побудувати щось неймовірне з нуля. Допомога кваліфікованих менторів, цінні призи, корисні знайомства та море адреналіну для розробників усіх рівнів.',
    category: 'ХАКАТОН',
    date: '2026-07-20',
    location: 'Харків, вул. Сумська 1',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)'
  }
]

export function useEvents() {
  const events = ref(initialEvents)

  const getEventById = (id) => {
    return events.value.find(e => e.id === Number(id))
  }

  return {
    events,
    getEventById
  }
}
