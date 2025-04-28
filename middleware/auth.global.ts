import { useUserStore } from "~/stores/auth/user/user.store"
import { updateLastActivity } from "~/composables/use_auth_api_client"

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore()

  // Update last activity timestamp on each route change
  if (process.client) {
    updateLastActivity()
  }

  // Don't affect auth-related routes
  const authRoutes = [
    '/accept-invitation',
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password/code',
    '/auth/reset-password/new'
  ]

  if (authRoutes.includes(to.path)) {
    return
  }

  // If we have a token but no current user, try to get the current user
  if (userStore.token && !userStore.currentUser) {
    try {
      await userStore.getCurrentUser()
    } catch (error) {
      // If getting the current user fails, the token might be invalid
      // Clear tokens and redirect to login
      userStore.clearUserToken()

      if (process.client) {
        // Set a flag in localStorage to indicate session expiry
        localStorage.setItem('session_expired', 'expired')
      }

      return await navigateTo({ path: '/auth/login', replace: true })
    }
  }

  // Check if there is no user and move to the sign in page
  if (!userStore.token || !userStore.currentUser) {
    console.log("User not logged in")
    return await navigateTo({ path: '/auth/login', replace: true })
  }
})
