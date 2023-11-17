import { defineStore } from 'pinia';
import { UserModel } from '~/server/api/user/model/user.model';

export const useAuthStore = defineStore({
  id: 'authStore',
  state: () => ({
    currentUser : {objectId: "95lmGWfP9C"}
   }),
  actions: {}
})
