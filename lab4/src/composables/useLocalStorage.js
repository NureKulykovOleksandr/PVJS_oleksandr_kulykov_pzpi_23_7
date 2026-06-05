import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const data = ref(defaultValue)

  // Load from localStorage on init
  const load = () => {
    const stored = localStorage.getItem(key)
    if (stored !== null) {
      try {
        data.value = JSON.parse(stored)
      } catch (e) {
        data.value = defaultValue
      }
    }
  }

  load()

  // Watch for changes and save
  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })

  return data
}
