
import { defineStore } from 'pinia';
import { RoleModel, type IRole } from '~/stores/auth/user/model/role.model';
import { UserModel, type User } from '~/stores/auth/user/model/user.model';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';

export const useUserStore = defineStore('user', {
  state: () => ({
    apiState: ApiResponseState.NULL,
    apiFailure: { message: "" },
    users: [] as User[],
    currentUser: null as User | null,
    currentUserApiState: ApiResponseState.NULL,
    token: useCookie('WF_UT', { maxAge: 60 * 60 }).value ?? "", //Cookie set for an hour

    // INVITE NEW USER
    apiInviteNewUserState: ApiResponseState.NULL,
    apiCreateNewInviteLinkState: ApiResponseState.NULL,
    apiInviteNewUserFailure: { message: "" },
    newInviteId: "",

    // USER ROLES
    apiRoleState: ApiResponseState.NULL,
    apiRoleFailure: { message: "" },
    roles: [] as IRole[],
    // ORGANISATIONS
    organisations: [{
      objectId: "org123",
      name: "Test Organization",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }],
    selectedOrganisation: {
      objectId: "org123",
      name: "Test Organization",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    loading_UserOrganisations: false,
  }),

  actions: {
    setUserToken(token?: string) {
      const cookie = useCookie('WF_UT', { maxAge: 60 * 60 });
      cookie.value = token ?? "";
    },

    clearUserToken() {
      const cookie = useCookie('WF_UT');
      cookie.value = null;
    },

    async getCurrentUser() {
      try {
        if (!this.token) {
          this.currentUser = null;
          return null;
        }

        this.currentUserApiState = ApiResponseState.LOADING;
        const data = await $fetch(`${useRuntimeConfig().public.API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${this.token}`
          }
        });

        this.currentUserApiState = ApiResponseState.SUCCESS;
        this.currentUser = UserModel.fromMap(data as any);
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

    async inviteNewUser(newUser: UserModel, isLink: boolean = true) {
      try {
        this.apiInviteNewUserState = ApiResponseState.LOADING;
        if (isLink) {
          this.apiCreateNewInviteLinkState = ApiResponseState.LOADING;
        }

        const data = await useStoreFetchRequest('/api/auth/user/invite', 'POST', {
          method: 'POST',
          body: { ...newUser.user, isLink }
        });

        this.apiInviteNewUserState = ApiResponseState.SUCCESS;
        this.newInviteId = (data as any).objectId;

        if (isLink) {
          this.apiCreateNewInviteLinkState = ApiResponseState.SUCCESS;
        }
      } catch (error) {
        this.apiInviteNewUserFailure.message = 'Could not invite new user';
        this.apiInviteNewUserState = ApiResponseState.FAILED;
        if (isLink) {
          this.apiCreateNewInviteLinkState = ApiResponseState.FAILED;
        }
        throw error;
      }
    },

    resetInviteState() {
      this.apiInviteNewUserState = ApiResponseState.NULL;
      this.apiCreateNewInviteLinkState = ApiResponseState.NULL;
      this.apiInviteNewUserFailure.message = "";
    },

    async manageUserRoles(options: { userId: string, roles?: string[], op: 'add' | 'remove' }) {
      try {
        if (!options.userId) {
          throw new Error("User ID required");
        }

        this.apiRoleState = ApiResponseState.LOADING;
        const data = await useStoreFetchRequest('/api/auth/user/role', 'PUT', {
          method: 'PUT',
          body: options
        });

        this.apiRoleState = ApiResponseState.SUCCESS;
        return data;
      } catch (error) {
        this.apiRoleFailure.message = 'Could not update user roles';
        this.apiRoleState = ApiResponseState.FAILED;
        throw error;
      }
    },

    async getAllUserRoles() {
      try {
        this.apiRoleState = ApiResponseState.LOADING;
        const data = await useStoreFetchRequest('/api/auth/user/role', 'GET');
        
        this.roles = (data as any).map((roleData: any) => RoleModel.fromMap(roleData));
        this.apiRoleState = ApiResponseState.SUCCESS;
      } catch (error) {
        this.apiRoleFailure.message = 'Could not load roles';
        this.apiRoleState = ApiResponseState.FAILED;
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

    // New Invite
    isInvitingNewUser: (state) => state.apiInviteNewUserState === ApiResponseState.LOADING,
    failed_InviteNewUser: (state) => state.apiInviteNewUserState === ApiResponseState.FAILED,
    success_InviteNewUser: (state) => state.apiInviteNewUserState === ApiResponseState.SUCCESS,

    isCreatingNewInviteLink: (state) => state.apiCreateNewInviteLinkState === ApiResponseState.LOADING,
    failed_CreatingNewInviteLink: (state) => state.apiCreateNewInviteLinkState === ApiResponseState.FAILED,
    success_CreatingNewInviteLink: (state) => state.apiCreateNewInviteLinkState === ApiResponseState.SUCCESS,

    // Roles
    loading_GettingAllRoles: (state) => state.apiRoleState === ApiResponseState.LOADING,
    failed_GettingAllRoles: (state) => state.apiRoleState === ApiResponseState.FAILED,
    success_GettingAllRoles: (state) => state.apiRoleState === ApiResponseState.SUCCESS
  }
});