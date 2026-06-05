<template>
  <div class="app-wrapper">
    <!-- Navbar Header -->
    <header class="app-navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">
          <span class="logo-icon">📅</span>
          EventHub
        </router-link>
        
        <nav class="nav-links">
          <router-link to="/" class="nav-link" active-class="active-link" exact-active-class="active-link">
            Список подій
          </router-link>
        </nav>
      </div>
    </header>

    <!-- Main Views wrapping Transition and KeepAlive -->
    <main class="container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
// Main view layout entry
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-navbar {
  background: rgba(9, 11, 17, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 1.3rem;
  font-weight: 750;
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-links {
  display: flex;
}

.nav-link {
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 550;
  font-size: 0.95rem;
  position: relative;
  padding: 4px 0;
  transition: color 0.3s ease;
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
}
</style>
