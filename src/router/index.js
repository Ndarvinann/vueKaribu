import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/produce/procurement',
    name: 'ProduceProcurement',
    component: () => import('../views/ProduceProcurement.vue'),
    meta: { requiresAuth: true, requiresManager: true }
  },
  {
    path: '/produce/sales',
    name: 'ProduceSales',
    component: () => import('../views/ProduceSales.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/produce/credit',
    name: 'ProduceCredit',
    component: () => import('../views/ProduceCredit.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else if (to.meta.requiresManager && !authStore.isManager) {
    next('/')
  } else {
    next()
  }
})

export default router