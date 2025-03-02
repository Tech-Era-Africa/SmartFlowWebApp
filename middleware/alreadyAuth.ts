import { useUserStore } from "~/stores/auth/user/user.store";

export default defineNuxtRouteMiddleware(async (to, from) => {

    const userStore = useUserStore()

    // If the current user exists navigate to the dashboard
    if (userStore.successCurrentUser) {
        console.log("SUCCESSFULLY LOGGED IN")
        return await navigateTo({ path: '/overview', replace: true })

    }
})
