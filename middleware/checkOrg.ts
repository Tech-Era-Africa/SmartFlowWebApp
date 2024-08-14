import { useUserStore } from "~/stores/auth/user/user.store"

export default defineNuxtRouteMiddleware(async (to, from) => {

  const userStore = useUserStore()

  // Find the user's organisations
  await userStore.getUserOrganisations();

  if(userStore.success_UserOrganisations){
    userStore.setCurrentUserOrg() //Takes the first and assigns it as the current org
    return;
  }

  // Navigate to new org page if there are no orgs
  if (userStore.success_UserOrganisations && userStore.organisations.length == 0) {
    return await navigateTo({ path: '/org/new', replace: true })
  }

})
