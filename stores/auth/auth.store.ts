import { defineStore } from 'pinia';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';
import type { LoginDTO } from './dto/login.dto';
import type { SignupDTO } from './dto/signup.dto';
import { useUserStore } from './user/user.store';

export const useAuthStore = defineStore({
  id: 'authStore',
  state: () => ({
    // LOGIN
    loginState: ApiResponseState.NULL,
    loginFailure: { message: "" },

    // SIGNUP
    signupState: ApiResponseState.NULL,
    signupFailure: { message: "" },

    // RESET PASSWORD
    resetPasswordState: ApiResponseState.NULL,
    resetPasswordFailure: { message: "" },
    resetPasswordEmail: "", // Store email during password reset flow

    // VERIFY RESET CODE
    verifyResetCodeState: ApiResponseState.NULL,
    verifyResetCodeFailure: { message: "" },

    // UPDATE PASSWORD
    updatePasswordState: ApiResponseState.NULL,
    updatePasswordFailure: { message: "" },

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

        // Set user token
        useUserStore().setUserToken(data.access_token);
        useUserStore().setRefreshToken(data.refresh_token);

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
    },

    async signUp(data: SignupDTO) {
      try {
        this.signupState = ApiResponseState.LOADING;

        const url = `${useRuntimeConfig().public.API_BASE_URL}/auth/signup`;

        const response = await $fetch<any>(url, {
          method: 'POST',
          body: data
        });

        this.signupState = ApiResponseState.SUCCESS;
        return response;

      } catch (error: any) {
        console.error('Signup error:', error);

        let message = 'Failed to create account. Please try again.';

        if (error.status === 400) {
          message = 'Invalid signup data. Please check your information.';
        } else if (error.status === 409) {
          message = 'An account with this email already exists.';
        } else if (error.status === 500) {
          message = 'Server error. Please try again later.';
        } else if (!error.status) {
          message = 'Network error. Please check your connection.';
        }

        this.signupFailure.message = message;
        this.signupState = ApiResponseState.FAILED;
        throw new Error(message);
      }
    },

    async resetPassword(data: { email: string }) {
      try {
        this.resetPasswordState = ApiResponseState.LOADING;
        this.resetPasswordEmail = data.email; // Store email for the reset flow

        const url = `${useRuntimeConfig().public.API_BASE_URL}/auth/password-reset`;

        await $fetch(url, {
          method: 'POST',
          body: {
            email: data.email
          }
        });

        this.resetPasswordState = ApiResponseState.SUCCESS;

      } catch (error: any) {
        let message = 'Failed to send reset password instructions.';

        if (error.status === 404) {
          message = 'Email address not found.';
        } else if (error.status === 500) {
          message = 'Server error. Please try again later.';
        } else if (!error.status) {
          message = 'Network error. Please check your connection.';
        }

        this.resetPasswordFailure.message = message;
        this.resetPasswordState = ApiResponseState.FAILED;
      }
    },
    // VERIFY RESET CODE
    async verifyResetCode(data: { email: string, code: string }) {
      try {
        this.verifyResetCodeState = ApiResponseState.LOADING;

        const url = `${useRuntimeConfig().public.API_BASE_URL}/auth/verify-password-reset-code`;

        await $fetch(url, {
          method: 'POST',
          body: {
            email: data.email,
            code: data.code
          }
        });

        this.verifyResetCodeState = ApiResponseState.SUCCESS;

      } catch (error: any) {
        let message = 'Failed to verify reset code.';

        if (error.status === 404) {
          message = 'Invalid verification code.';
        } else if (error.status === 500) {
          message = 'Server error. Please try again later.';
        } else if (!error.status) {
          message = 'Network error. Please check your connection.';
        }

        this.verifyResetCodeFailure.message = message;
        this.verifyResetCodeState = ApiResponseState.FAILED;
      }
    },

    async updatePassword(data: { email: string, password: string }) {
      try {
        this.updatePasswordState = ApiResponseState.LOADING;

        const url = `${useRuntimeConfig().public.API_BASE_URL}/auth/reset-password`;

        await $fetch(url, {
          method: 'POST',
          body: {
            email: data.email,
            password: data.password
          }
        });

        this.updatePasswordState = ApiResponseState.SUCCESS;

      } catch (error: any) {
        let message = 'Failed to update password.';

        if (error.status === 404) {
          message = 'Account not found.';
        } else if (error.status === 400) {
          message = 'Invalid password format.';
        } else if (error.status === 500) {
          message = 'Server error. Please try again later.';
        } else if (!error.status) {
          message = 'Network error. Please check your connection.';
        }

        this.updatePasswordFailure.message = message;
        this.updatePasswordState = ApiResponseState.FAILED;
      }
    },
  },

  getters: {
    isLoggingUserIn: (state) => state.loginState === ApiResponseState.LOADING,
    failed_LoginUser: (state) => state.loginState === ApiResponseState.FAILED,
    success_LoginUser: (state) => state.loginState === ApiResponseState.SUCCESS,

    isResettingPassword: (state) => state.resetPasswordState === ApiResponseState.LOADING,
    failed_ResetPassword: (state) => state.resetPasswordState === ApiResponseState.FAILED,
    success_ResetPassword: (state) => state.resetPasswordState === ApiResponseState.SUCCESS,
    isVerifyingResetCode: (state) => state.verifyResetCodeState === ApiResponseState.LOADING,
    failed_VerifyResetCode: (state) => state.verifyResetCodeState === ApiResponseState.FAILED,
    success_VerifyResetCode: (state) => state.verifyResetCodeState === ApiResponseState.SUCCESS,

    isUpdatingPassword: (state) => state.updatePasswordState === ApiResponseState.LOADING,
    failed_UpdatePassword: (state) => state.updatePasswordState === ApiResponseState.FAILED,
    success_UpdatePassword: (state) => state.updatePasswordState === ApiResponseState.SUCCESS,
  }
})
