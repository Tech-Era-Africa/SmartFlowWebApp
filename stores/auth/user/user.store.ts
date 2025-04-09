
import { defineStore } from 'pinia';
import { UserModel, type User } from '~/stores/auth/user/model/user.model';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';

export const useUserStore = defineStore('user', {
  state: () => ({
    apiState: ApiResponseState.NULL,
    apiFailure: { message: "" },
    users: [] as User[],
    currentUser: null as User | null,
    currentUserApiState: ApiResponseState.NULL,
    token: useCookie('WF_UT', { maxAge: 60 * 60 }).value ?? "",
    refreshToken: useCookie('WF_RT', { maxAge: 24 * 60 * 60 }).value ?? "", // 24 hour refresh token
  }),

  actions: {
    setUserToken(token?: string) {
      const access_token_cookie = useCookie('WF_UT', { maxAge: 60 * 60 });
      access_token_cookie.value = token ?? "";
    },

    setRefreshToken(token?: string) {
      const refresh_token_cookie = useCookie('WF_RT', { maxAge: 7 * 24 * 60 * 60 });
      refresh_token_cookie.value = token ?? "";
    },

    clearUserToken() {
      const access_token_cookie = useCookie('WF_UT');
      access_token_cookie.value = null;

      const refresh_token_cookie = useCookie('WF_RT');
      refresh_token_cookie.value = null;
    },

    async refreshAccessToken() {
      // If no refresh token is available, return false immediately
      if (!this.refreshToken) {
        console.warn('No refresh token available');
        return false;
      }

      try {
        console.log('Attempting to refresh access token...');
        const { data, error } = await useFetch(`${useRuntimeConfig().public.API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          body: {
            refreshToken: this.refreshToken
          }
        });

        // Check for errors
        if (error.value) {
          console.error('Token refresh failed:', error.value);
          // Clear tokens on refresh failure
          this.clearUserToken();
          return false;
        }

        // Check if we got valid data back
        if (data.value && (data.value as any).access_token) {
          console.log('Token refresh successful');
          this.setUserToken((data.value as any).access_token);

          // If a new refresh token is provided, update it too
          if ((data.value as any).refresh_token) {
            this.setRefreshToken((data.value as any).refresh_token);
          }

          return true;
        }

        console.warn('Token refresh response did not contain a new access token');
        return false;
      } catch (error) {
        console.error('Token refresh error:', error);
        // Clear tokens on refresh failure
        this.clearUserToken();
        return false;
      }
    },

    async getCurrentUser() {
      try {
        // If no token is available, return null immediately
        if (!this.token) {
          this.currentUserApiState = ApiResponseState.FAILED;
          this.currentUser = null;
          return null;
        }

        this.currentUserApiState = ApiResponseState.LOADING;

        try {
          // First attempt with current token
          const response = await $fetch(`${useRuntimeConfig().public.API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${this.token}`
            }
          });

          // If successful, update user and return
          this.currentUserApiState = ApiResponseState.SUCCESS;
          this.currentUser = UserModel.fromMap(response as any);
          return this.currentUser;

        } catch (error: any) {
          // If token is expired (401), try to refresh
          if (error.status === 401 && this.refreshToken) {
            console.log('Token expired, attempting to refresh...');
            const refreshed = await this.refreshAccessToken();

            if (refreshed) {
              // Try again with the new token
              try {
                const response = await $fetch(`${useRuntimeConfig().public.API_BASE_URL}/auth/me`, {
                  method: 'GET',
                  headers: {
                    "Authorization": `Bearer ${this.token}`
                  }
                });

                // If successful after refresh, update user and return
                this.currentUserApiState = ApiResponseState.SUCCESS;
                this.currentUser = UserModel.fromMap(response as any);
                return this.currentUser;
              } catch (retryError: any) {
                console.error('Failed to get user after token refresh:', retryError);
                throw retryError;
              }
            } else {
              console.error('Token refresh failed');
              // If refresh failed, clear tokens
              this.clearUserToken();
              throw new Error('Session expired. Please log in again.');
            }
          }

          // For other errors, just throw them
          throw error;
        }
      } catch (error: any) {
        this.currentUserApiState = ApiResponseState.FAILED;
        this.currentUser = null;

        // Set session expired flag if it was an auth error
        if (error.status === 401 && process.client) {
          localStorage.setItem('session_expired', 'expired');
        }

        console.error('Could not get current user:', error);
        throw new Error(error.message || 'Could not get current user');
      }
    },

    async getAllUsers() {
      try {
        this.apiState = ApiResponseState.LOADING;
        const data = await useStoreFetchRequest('/api/auth/user/all', 'GET');

        this.users = (data as any).results.map((userData: any) => UserModel.fromMap(userData));
        this.apiState = ApiResponseState.SUCCESS;
      } catch (error) {
        this.apiFailure.message = 'Could not load users';
        this.apiState = ApiResponseState.FAILED;
        throw error;
      }
    },

    exportToCSV() {
      return useExportToCSV({
        fileName: `Users_${Date.now()}`,
        header: ["Id", "First Name", "Last Name", "Email"],
        records: this.transformUserToCSVData()
      });
    },

    transformUserToCSVData(): any[] {
      return this.users.map(user => [
        user.id,
        user.firstName,
        user.lastName,
        user.email,
      ]);
    }
  },

  getters: {
    hasUsers: (state) => state.apiState === ApiResponseState.SUCCESS && state.users.length > 0,
    isLoading: (state) => state.apiState === ApiResponseState.LOADING,
    failed: (state) => state.apiState === ApiResponseState.FAILED,
    success: (state) => state.apiState === ApiResponseState.SUCCESS,

    // Current User
    isLoadingCurrentUser: (state) => state.currentUserApiState === ApiResponseState.LOADING,
    failedCurrentUser: (state) => state.currentUserApiState === ApiResponseState.FAILED,
    successCurrentUser: (state) => state.currentUserApiState === ApiResponseState.SUCCESS,
  }
});