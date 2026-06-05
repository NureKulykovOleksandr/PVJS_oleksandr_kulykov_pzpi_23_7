<template>
  <div class="app-wrapper">
    <!-- Top Navigation Header -->
    <header class="app-navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">
          <span class="logo-badge">⚡</span>
          TaskFlow
        </router-link>
        
        <nav class="nav-links">
          <router-link to="/" class="nav-link" active-class="active-link" exact-active-class="active-link">
            Задачі
          </router-link>
          <router-link to="/stats" class="nav-link" active-class="active-link">
            Статистика
          </router-link>
        </nav>
      </div>
    </header>

    <!-- Main Content with Route Transitions -->
    <main class="container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
// Main entry layout
</script>

<style scoped>
.app-navbar {
  background: rgba(17, 23, 38, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.01em;
}

.logo-badge {
  background: var(--primary-gradient);
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  padding: 4px 0;
}

.nav-link:hover {
  color: #fff;
}

.active-link {
  color: #fff;
}

.active-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--primary-gradient);
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(124, 58, 237, 0.6);
}
</style>
