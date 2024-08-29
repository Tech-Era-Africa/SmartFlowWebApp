import type { User } from "~/stores/auth/user/model/user.model";
import { useUserStore } from "~/stores/auth/user/user.store";


export default defineNuxtPlugin(async (nuxtApp) => {
    const userStore = useUserStore()

     // If the current user does not exist get it
     if (!userStore.successCurrentUser){
        await userStore.getCurrentUser();
        return;
    }
})
