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

        // For development, use dummy successful response
        const dummyResponse = {
          access_token: 'dummy_token_' + Date.now(),
          user: {
            id: 'user123',
            email: cred.email,
            name: 'Test User'
          }
        };

        // Set user token
        useUserStore().setUserToken(dummyResponse.access_token);
        this.loginState = ApiResponseState.SUCCESS;

      } catch (error: any) {
        let message = 'Something went wrong. Login failed.';

        if (error.status === 401) {
          message = 'Invalid email or password. Please try again.';
        } else if (error.status === 403) {
          message = 'Account is disabled. Please contact support.';
        } else if (error.status === 404) {
          message = 'Account does not exist. Please contact support.';
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

    async resetPassword(data: { email: string }) {
      try {
        this.resetPasswordState = ApiResponseState.LOADING;
        this.resetPasswordEmail = data.email;

        // Simulate API call success
        await new Promise(resolve => setTimeout(resolve, 1000));
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

    async verifyResetCode(data: { email: string, code: string }) {
      try {
        this.verifyResetCodeState = ApiResponseState.LOADING;

        // Simulate API call success
        await new Promise(resolve => setTimeout(resolve, 1000));
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

        // Simulate API call success
        await new Promise(resolve => setTimeout(resolve, 1000));
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
