import { defineStore } from 'pinia';
import { UserModel } from '~/server/api/auth/user/model/user.model';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';
import type { LoginDTO } from './dto/login.dto';
import { useUserStore } from './user/user.store';

export const useAuthStore = defineStore({
  id: 'authStore',
  state: () => ({
    // LOGIN
    loginState: ApiResponseState.NULL,
    loginFailure: { message: "" },


  }),
  actions: {
    async loginWithEmail(cred: LoginDTO) {
      try {
        this.loginState = ApiResponseState.LOADING;
        const data = await useStoreFetchRequest('/api/auth/login', 'POST', {
          email: cred.email,
          password: cred.password
        });
        this.loginState = ApiResponseState.SUCCESS;

        // Set user token
        useUserStore().setUserToken((data as any).sessionToken) //TODO!: Give the data repsonse a type

        // Setup user data 
        useUserStore().currentUser = UserModel.fromMap(data).user
        console.log(useUserStore().currentUser)
        this.loginState = ApiResponseState.SUCCESS;

      } catch (error: any) {
        this.loginFailure.message = error.message;
        this.loginState = ApiResponseState.FAILED;
      }
    },
  },

  getters:{
    isLoggingUserIn: (state) => state.loginState === ApiResponseState.LOADING,
    failed_LoginUser: (state) => state.loginState === ApiResponseState.FAILED,
    success_LoginUser: (state) => state.loginState === ApiResponseState.SUCCESS,
  }
})
