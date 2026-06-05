<script setup>
import { ref, computed } from 'vue'

// 1. Змінні стану
const tasks = ref([])           // Масив для збереження списку задач
const newTask = ref('')         // Збереження значення поля введення
const currentFilter = ref('all') // Поточний режим фільтрації

// 2. Функція додавання задачі
const addTask = () => {
  // Перевірка на порожній рядок
  if (newTask.value.trim() === '') return

  // Додавання нової задачі до масиву
  tasks.value.push({
    id: Date.now(), // Унікальний ідентифікатор
    text: newTask.value,
    completed: false
  })
  
  newTask.value = ''
}

// 3. Функція видалення задачі
const deleteTask = (taskId) => {
  tasks.value = tasks.value.filter(task => task.id !== taskId)
}

// 4. Фільтрація задач
const filteredTasks = computed(() => {
  if (currentFilter.value === 'active') {
    return tasks.value.filter(task => !task.completed)
  } else if (currentFilter.value === 'completed') {
    return tasks.value.filter(task => task.completed)
  }
  return tasks.value
})
</script>

<template>
  <div class="app-container">
    <h1>Список задач TO-DO List</h1>

    <div class="input-section">
      <input 
        v-model="newTask" 
        @keyup.enter="addTask" 
        type="text" 
        placeholder="Введіть задачу" 
      />
      <button @click="addTask">Додати</button>
    </div>

    <div class="filters">
      <button :class="{ active: currentFilter === 'all' }" @click="currentFilter = 'all'">Всі</button>
      <button :class="{ active: currentFilter === 'active' }" @click="currentFilter = 'active'">Активні</button>
      <button :class="{ active: currentFilter === 'completed' }" @click="currentFilter = 'completed'">Виконані</button>
    </div>

    <ul class="task-list">
      <li 
        v-for="task in filteredTasks" 
        :key="task.id" 
        :class="{ completed: task.completed }"
      >
        <label class="task-label">
          <input type="checkbox" v-model="task.completed" />
          <span class="task-text">{{ task.text }}</span>
        </label>
        
        <button class="delete-btn" @click="deleteTask(task.id)">Видалити</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 500px;
  margin: 2rem auto;
  font-family: sans-serif;
  background-color: #1e1e2f;
  color: white;
  padding: 20px;
  border-radius: 10px;
}

h1 {
  text-align: center;
  font-size: 1.5rem;
}

.input-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input-section input {
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: none;
}

.input-section button {
  padding: 10px 15px;
  border-radius: 5px;
  border: none;
  background-color: #a855f7;
  color: white;
  cursor: pointer;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filters button {
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
}

.filters button.active {
  color: #a855f7;
  font-weight: bold;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2a2a40;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.task-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

/* Відображення виконаної задачі */
.completed .task-text {
  text-decoration: line-through;
  color: #888;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #ff4d4d;
  cursor: pointer;
}
</style>