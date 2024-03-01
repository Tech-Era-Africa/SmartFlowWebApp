import { useUserStore } from "~/stores/auth/user/user.store"

export default defineNuxtRouteMiddleware(async (to, from) => {
  
  // Check if there is no user and move to the sign in page
  if (!useUserStore().currentUser!.objectId){
    return await navigateTo({ path: '/auth/login', replace: true })
    
  }

})
