import type { User } from "~/server/api/auth/user/user.model";
import { useUserStore } from "~/stores/auth/user/user.store";


export default defineNuxtPlugin(async (nuxtApp) => {
    const userStore = useUserStore()

    // If the current user does not exist get it
    if (Object.keys(userStore.currentUser as User).length === 0){
        console.log("User empty, gettting user")
        return await userStore.getCurrentUser();
    }
})
