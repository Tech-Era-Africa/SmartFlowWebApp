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

  // Fetch the user's organizations
  await userStore.getUserOrganisations();

  // If there are no organizations, navigate to the new organization page
  if (userStore.organisations.length === 0) {
    return navigateTo({ path: '/org/new', replace: true });
  }

  // Set the current organization if the fetch was successful
  if (userStore.success_UserOrganisations) {
    userStore.setCurrentUserOrg(); // Takes the first and assigns it as the current org
  }

})
