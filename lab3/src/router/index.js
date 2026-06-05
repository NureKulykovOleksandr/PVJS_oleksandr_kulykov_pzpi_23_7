import { createRouter, createWebHistory } from 'vue-router'
import TaskListView from '../views/TaskListView.vue'
import TaskDetailView from '../views/TaskDetailView.vue'
import TaskFormView from '../views/TaskFormView.vue'
import StatsView from '../views/StatsView.vue'

const routes = [
  {
    path: '/',
    name: 'TaskList',
    component: TaskListView
  },
  {
    path: '/tasks/:id',
    name: 'TaskDetail',
    component: TaskDetailView,
    props: true
  },
  {
    path: '/tasks/new',
    name: 'TaskCreate',
    component: TaskFormView
  },
  {
    path: '/tasks/:id/edit',
    name: 'TaskEdit',
    component: TaskFormView,
    props: true
  },
  {
    path: '/stats',
    name: 'Stats',
    component: StatsView
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

export default router
