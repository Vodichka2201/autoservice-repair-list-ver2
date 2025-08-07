import { defineStore } from 'pinia'
import api from '@/api/strapi'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    status: 'out' // 'loading' | 'in' | 'out'
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email,
    userId: (state) => state.user?.id
  },

  actions: {
    async init() {
      this.loading = true
      const userData = localStorage.getItem('user')
      const token = localStorage.getItem('jwt')
      
      if (userData && token) {
        try {
          // Verify token is still valid
          this.user = JSON.parse(userData)
          this.token = token
          await api.get('/users/me') // Validate token
          this.status = 'in'
        } catch (error) {
          console.error('Token validation failed:', error)
          this.logout() // Clear invalid session
        }
      } else {
        this.status = 'out'
      }
      this.loading = false
      return this.user
    },

    async loginWithEmail(email, password) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/local', {
          identifier: email,
          password: password
        })
        
        this.user = response.data.user
        this.token = response.data.jwt
        this.status = 'in'
        
        // Store auth data with expiration check
        localStorage.setItem('user', JSON.stringify({
          ...this.user,
          expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        }))
        localStorage.setItem('jwt', this.token)
        
        // Set up token refresh timer
        this.scheduleTokenRefresh()
        
        return this.user
      } catch (error) {
        this.error = error.response?.data?.error?.message || 
                    error.message || 
                    'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    scheduleTokenRefresh() {
      // Clear existing timer if any
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer)
      }
      
      // Set new timer to refresh token 1 hour before expiration
      this.refreshTimer = setTimeout(() => {
        this.refreshToken()
      }, 6 * 60 * 60 * 1000) // 6 hours
    },

    async refreshToken() {
      if (!this.token) return
      
      try {
        const response = await api.post('/token/refresh', {
          token: this.token
        })
        
        this.token = response.data.jwt
        localStorage.setItem('jwt', this.token)
        this.scheduleTokenRefresh()
      } catch (error) {
        console.error('Token refresh failed:', error)
        this.logout()
      }
    },

    async logout() {
      this.loading = true
      this.error = null
      try {
        localStorage.removeItem('user')
        localStorage.removeItem('jwt')
        this.user = null
        this.token = null
        this.status = 'out'
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})
