
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
    setUserToken(token?: string, refreshToken?: string) {
      const access_token_cookie = useCookie('WF_UT', { maxAge: 60 * 60 });
      access_token_cookie.value = token ?? "";

      const refresh_token_cookie = useCookie('WF_RT', { maxAge: 60 * 60 });
      refresh_token_cookie.value = refreshToken ?? "";
    },

    clearUserToken() {
      const access_token_cookie = useCookie('WF_UT');
      access_token_cookie.value = null;

      const refresh_token_cookie = useCookie('WF_RT');
      refresh_token_cookie.value = null;
    },

    async refreshAccessToken() {
      try {
        const { data } = await useFetch(`${useRuntimeConfig().public.API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          body: {
            refreshToken: this.refreshToken
          }
        });

        if (data.value) {
          this.setUserToken((data.value as any).access_token, (data.value as any).refresh_token);
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },

    async getCurrentUser() {
      try {
        if (!this.token) {
          this.currentUser = null;
          return null;
        }

        this.currentUserApiState = ApiResponseState.LOADING;
        let response = await $fetch(`${useRuntimeConfig().public.API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${this.token}`
          }
        }).catch(async (error) => {
          if (error.status === 401 && this.refreshToken) {
            const refreshed = await this.refreshAccessToken();
            if (refreshed) {
              return await $fetch(`${useRuntimeConfig().public.API_BASE_URL}/auth/me`, {
                method: 'GET',
                headers: {
                  "Authorization": `Bearer ${this.token}`
                }
              });
            }
          }
          throw error;
        });

        this.currentUserApiState = ApiResponseState.SUCCESS;
        this.currentUser = UserModel.fromMap(response as any);
        return this.currentUser;

      } catch (error) {
        this.currentUserApiState = ApiResponseState.FAILED;
        this.currentUser = null;
        throw new Error('Could not get current user');
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