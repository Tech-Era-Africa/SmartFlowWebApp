import { useUserStore } from "~/stores/auth/user/user.store"

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore()

  // Dont affect the login route
  if (to.path === '/auth/login' || to.path === '/auth/signup' || to.path === '/auth/forgot-password' || to.path === '/auth/reset-password/code' || to.path === '/auth/reset-password/new') {
    return
  }

  // Check if there is no user and move to the sign in page
  if (!userStore.successCurrentUser) {
    console.log("User not logged in")
    return await navigateTo({ path: '/auth/login', replace: true })

  }


})
