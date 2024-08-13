import type { User } from "~/stores/auth/user/model/user.model";
import { useUserStore } from "~/stores/auth/user/user.store";


export default defineNuxtPlugin(async (nuxtApp) => {
    const userStore = useUserStore()

    // If the current user does not exist get it
    if (Object.keys(userStore.currentUser as User).length === 0){
        return await userStore.getCurrentUser();
    }
})
