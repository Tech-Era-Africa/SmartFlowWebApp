import { defineStore } from 'pinia';
import { UserModel } from '~/stores/auth/user/model/user.model';
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
    
        const data = await $fetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/auth/login`, {
          method : 'POST',
          body :{
            email: cred.email,
            password: cred.password,
          }
        });

        // Set user token
        useUserStore().setUserToken(data.access_token);

        this.loginState = ApiResponseState.SUCCESS;
    
      } catch (error: any) {
        this.loginFailure.message = error.message || 'An unexpected error occurred.';
        this.loginState = ApiResponseState.FAILED;
      }
    },

    logoutUser() {
      useUserStore().clearUserToken()
    }
  },

  getters: {
    isLoggingUserIn: (state) => state.loginState === ApiResponseState.LOADING,
    failed_LoginUser: (state) => state.loginState === ApiResponseState.FAILED,
    success_LoginUser: (state) => state.loginState === ApiResponseState.SUCCESS,
  }
})
