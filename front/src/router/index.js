import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'



const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import('../views/Main.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/Settings.vue'),
  },
  {
    path: '/clients',
    name: 'clients',
    component: () => import('../views/Clients.vue'),
  },
  {
    path: '/cars',
    name: 'cars',
    component: () => import('../views/Cars.vue'),
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('../views/Orders.vue'),
  },
  {
    path: '/repair-monitor',
    name: 'repair-monitor',
    component: () => import('../views/RepairMonitor.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { left: 0, top: 0 }
  }
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestRoute = to.matched.some(record => record.meta.guest)
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (isGuestRoute && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
