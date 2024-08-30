import { useUserStore } from "~/stores/auth/user/user.store";

export default defineNuxtRouteMiddleware(async (to, from) => {

    const userStore = useUserStore()

    // If the current user exists navigate to the dashboard
    if (userStore.successCurrentUser) {
        console.log("SUCCESSFULLY LOGGED IN")
        // Check for existing organisation
        if(userStore.currentUser?.orgData.length === 0) return await navigateTo({ path: '/org/new', replace: true })

        return await navigateTo({ path: '/overview', replace: true })

    }
})
