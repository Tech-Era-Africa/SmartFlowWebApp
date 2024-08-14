import { useUserStore } from "~/stores/auth/user/user.store"

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore()

  // Dont affect the login route
  if (to.path === '/auth/login') {
    console.log("Navigating to login")
    return
  }

  // Check if there is no user and move to the sign in page
  if (!userStore.successCurrentUser) {
    return await navigateTo({ path: '/auth/login', replace: true })

  }

})
