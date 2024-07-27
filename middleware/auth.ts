import { useUserStore } from "~/stores/auth/user/user.store"

export default defineNuxtRouteMiddleware(async (to, from) => {

  const userStore = useUserStore()

  // Check if there is no user and move to the sign in page
  if (!userStore.currentUser!.objectId) {
    return await navigateTo({ path: '/auth/login', replace: true })

  }

  // Navigate to new org page if there are no orgs
  if (userStore.organisations.length == 0) {
    return await navigateTo({ path: '/org/new', replace: true })
  }

})
