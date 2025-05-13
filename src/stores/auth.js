import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    isManager: (state) => state.user?.role === 'manager',
    isDirector: (state) => state.user?.role === 'director'
  },
  
  actions: {
    login(credentials) {
      // TODO: Implement actual login logic
      this.user = {
        id: '1',
        name: 'Test User',
        role: 'manager',
        branch: 'Maganjo'
      }
      this.token = 'test-token'
    },
    
    logout() {
      this.user = null
      this.token = null
    }
  }
})