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

        const url = `${useRuntimeConfig().public.API_BASE_URL}/auth/login`;

        const data = await $fetch<any>(url, {
          method: 'POST',
          body: {
            email: cred.email,
            password: cred.password,
          }
        });

        console.log(data)

        // Set user token
        useUserStore().setUserToken(data.access_token);

        this.loginState = ApiResponseState.SUCCESS;

      } catch (error: any) {

        console.log(error)

        let message = 'Something went wrong. Login failed.';

        if (error.status === 401) {
          message = 'Invalid email or password. Please try again.';
        } else if (error.status === 403) {
          message = 'Account is disabled. Please contact support.';
        }
        else if (error.status === 404) {
          message = 'Account does not exist . Please contact support.';
        } else if (error.status === 500) {
          message = 'Server error. Please try again later.';
        } else if (!error.status) {
          message = 'Network error. Please check your connection.';
        }

        this.loginFailure.message = message;
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
