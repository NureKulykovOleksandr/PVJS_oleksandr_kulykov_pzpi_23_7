import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref([])

  // Load initial tasks from LocalStorage
  const loadTasks = () => {
    const stored = localStorage.getItem('task-manager-tasks')
    if (stored) {
      try {
        tasks.value = JSON.parse(stored)
      } catch (e) {
        tasks.value = []
      }
    } else {
      // Seed initial tasks if empty
      tasks.value = [
        {
          id: 1,
          title: 'Підготувати презентацію до захисту',
          description: 'Підготувати слайди для захисту лабораторної роботи №3. Включити опис архітектури, Pinia store та Vue Router.',
          category: 'Робота',
          priority: 'Високий',
          deadline: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday (Overdue)
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Прочитати документацію Vue Router',
          description: 'Вивчити роботу з динамічними маршрутами, обробку параметрів через useRoute та програмну навігацію.',
          category: 'Навчання',
          priority: 'Середній',
          deadline: new Date(Date.now() + 172800000).toISOString().split('T')[0], // In 2 days (Upcoming)
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          title: 'Написати unit-тести для store',
          description: 'Покрити тестами getters та actions у taskStore.js для стабільності.',
          category: 'Робота',
          priority: 'Низький',
          deadline: new Date(Date.now() + 432000000).toISOString().split('T')[0], // In 5 days
          completed: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 4,
          title: 'Купити продукти на тиждень',
          description: 'Фрукти, овочі, молоко, хліб, крупи та м’ясо.',
          category: 'Особисте',
          priority: 'Низький',
          deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow (Upcoming)
          completed: false,
          createdAt: new Date().toISOString()
        }
      ]
      saveTasks()
    }
  }

  const saveTasks = () => {
    localStorage.setItem('task-manager-tasks', JSON.stringify(tasks.value))
  }

  // Watch for deep changes and sync to localStorage
  watch(tasks, () => {
    saveTasks()
  }, { deep: true })

  // Actions
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description || '',
      category: taskData.category || 'Інше',
      priority: taskData.priority || 'Середній',
      deadline: taskData.deadline,
      completed: false,
      createdAt: new Date().toISOString()
    }
    tasks.value.push(newTask)
    return newTask
  }

  const updateTask = (id, updatedFields) => {
    const index = tasks.value.findIndex(t => t.id === Number(id))
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updatedFields }
      return tasks.value[index]
    }
    return null
  }

  const deleteTask = (id) => {
    tasks.value = tasks.value.filter(t => t.id !== Number(id))
  }

  const toggleStatus = (id) => {
    const task = tasks.value.find(t => t.id === Number(id))
    if (task) {
      task.completed = !task.completed
    }
  }

  // Getters
  const activeTasks = computed(() => tasks.value.filter(t => !t.completed))
  const completedTasks = computed(() => tasks.value.filter(t => t.completed))

  const overdueTasks = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return tasks.value.filter(t => !t.completed && t.deadline < today)
  })

  const upcomingTasks = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    const threeDaysFromNow = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
    return tasks.value.filter(t => !t.completed && t.deadline >= today && t.deadline <= threeDaysFromNow)
  })

  const categoryCounts = computed(() => {
    const counts = {}
    tasks.value.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1
    })
    return counts
  })

  const totalTasksCount = computed(() => tasks.value.length)
  const activeTasksCount = computed(() => activeTasks.value.length)
  const completedTasksCount = computed(() => completedTasks.value.length)
  const overdueTasksCount = computed(() => overdueTasks.value.length)

  const completionPercentage = computed(() => {
    if (tasks.value.length === 0) return 0
    return Math.round((completedTasks.value.length / tasks.value.length) * 100)
  })

  // Initialize store
  loadTasks()

  return {
    tasks,
    activeTasks,
    completedTasks,
    overdueTasks,
    upcomingTasks,
    categoryCounts,
    totalTasksCount,
    activeTasksCount,
    completedTasksCount,
    overdueTasksCount,
    completionPercentage,
    addTask,
    updateTask,
    deleteTask,
    toggleStatus
  }
})
