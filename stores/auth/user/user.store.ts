
import { defineStore } from 'pinia';
import { RoleModel, type IRole } from '~/stores/auth/user/model/role.model';
import { UserModel, type User } from '~/stores/auth/user/model/user.model';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';
import type { IOrganisation } from './model/organisation.model';


export const useUserStore = defineStore('user', {
  state: () => ({
    apiState: ApiResponseState.NULL,
    apiFailure: { message: "" },
    users: [] as User[],
    currentUser: {} as User | null,
    token: useCookie('WF_UT', { maxAge: 60 * 60 }).value ?? "", //Cookie set for an hour

    // INVITE NEW USER
    apiInviteNewUserState: ApiResponseState.NULL,
    apiCreateNewInviteLinkState: ApiResponseState.NULL,
    apiInviteNewUserFailure: { message: "" },
    newInviteId: "",

    // USER
    apiRoleState: ApiResponseState.NULL,
    apiRoleFailure: { message: "" },
    roles: [] as IRole[],

    // ORGANISATIONS
    apiUserOrganisationState: ApiResponseState.NULL,
    apiUserOrganisationFailure: { message: "" },
    organisations: [] as IOrganisation[],
    selectedOrganisation: {} as IOrganisation

  }),
  actions: {

    setUserToken(token?: string) {
      useCookie('WF_UT', { maxAge: 60 * 60 }).value = token ?? ""
      console.log("Current user token set")
    },

    async getCurrentUser() {

      if (this.token) {
        try {
          //GET CURRENT USER
          // SERVER LOGIC
          const queryString = new URLSearchParams({ token: this.token }).toString();
          const data = await useStoreFetchRequest(`/api/auth/user/current?${queryString}`, 'GET');

          //DATA
          this.currentUser = UserModel.fromMap(data).user

          // Get the user's organisations
          // TODO!: MUST HANDLE ERROR CASES HERE
          await this.getUserOrganisations()

          if (this.success_UserOrganisations && this.organisations.length > 0) {
            // Select a default organisation
            this.selectedOrganisation = this.organisations[0]
            console.log(this.selectedOrganisation)
          }

        } catch (e) {
          // CLEAR ANY EXISTING USER DATA
          this.currentUser = null;
        }
        return;
      }

      // No token areas
      console.log("NO TOKEN FOUND")
    },

    async getAllUsers() {

      try {
        this.apiState = ApiResponseState.LOADING;

        // SERVER LOGIC
        const data = await useStoreFetchRequest('/api/auth/user/all', 'GET')
        // end of SERVER LOGIC

        // Data
        this.apiState = ApiResponseState.SUCCESS;
        this.users = (data as any).results.map((usersJson: User) => UserModel.fromMap(usersJson).user)

      } catch (error) {
        // Handle login error
        this.apiFailure.message = 'Server error! Could not load users';
        this.apiState = ApiResponseState.FAILED;
      }
    },

    async getUserOrganisations() {

      try {
        this.apiUserOrganisationState = ApiResponseState.LOADING;

        // SERVER LOGIC
        const queryString = new URLSearchParams({ userId: this.currentUser?.objectId! }).toString();
        const data = await useStoreFetchRequest(`/api/auth/user/organisation?${queryString}`, 'GET')
        // end of SERVER LOGIC

        // Data
        this.apiUserOrganisationState = ApiResponseState.SUCCESS;
        this.organisations = data as IOrganisation[]

      } catch (error) {
        // Handle login error
        this.apiUserOrganisationFailure.message = 'Server error! Could not load user organisations';
        this.apiUserOrganisationState = ApiResponseState.FAILED;
      }
    },

    resetInviteState() {
      this.apiInviteNewUserState = ApiResponseState.NULL;
    },

    async inviteNewUser(newUser: UserModel, isLink: boolean = true) {
      try {
        if (isLink) this.apiCreateNewInviteLinkState = ApiResponseState.LOADING;

        this.apiInviteNewUserState = ApiResponseState.LOADING;

        // SERVER LOGIC
        const data = await useStoreFetchRequest('/api/auth/user/invite', 'POST', {
          method: 'POST',
          body: { ...newUser.user, isLink }
        })
        // end of SERVER LOGIC


        // Success
        this.apiInviteNewUserState = ApiResponseState.SUCCESS;
        this.newInviteId = (data as any).objectId

      } catch (error) {
        // Handle login error
        console.log(error)
        this.apiInviteNewUserFailure.message = 'Server error! Could not invite new user';
        this.apiInviteNewUserState = ApiResponseState.FAILED;
      }
    },

    async manageUserRoles(options: { userId: string, roles?: string[], op: 'add' | 'remove' }) {
      try {

        if (!options.userId) throw Error("User id required")

        this.apiInviteNewUserState = ApiResponseState.LOADING;

        // SERVER LOGIC
        const data = await useStoreFetchRequest('/api/auth/user/role', 'PUT', {
          method: 'PUT',
          body: options
        })
        // end of SERVER LOGIC

        // Success
        this.apiInviteNewUserState = ApiResponseState.SUCCESS;
        this.newInviteId = (data as any).objectId

      } catch (error) {
        // Handle login error
        console.log(error)
        this.apiInviteNewUserFailure.message = 'Server error! Could not update user roles';
        this.apiInviteNewUserState = ApiResponseState.FAILED;
      }
    },

    async getAllUserRoles() {

      try {
        this.apiRoleState = ApiResponseState.LOADING;

        // SERVER LOGIC
        const data = await useStoreFetchRequest('/api/auth/user/role', 'GET')
        // end of SERVER LOGIC


        // Data
        this.apiRoleState = ApiResponseState.SUCCESS;
        this.roles = (data as any).map((role: any) => RoleModel.fromMap(role))

      } catch (error) {
        // Handle login error
        this.apiRoleFailure.message = 'Server error! Could not load roles.';
        this.apiRoleState = ApiResponseState.FAILED;
      }
    },

    exportToCSV() {
      return useExportToCSV({
        fileName: `CFCScreeningTool_Users_${Date.now()}`,
        header: ["Id", "First Name", "Middle Name", "Last Name", "Phone", "Avatar", "Email", "Location", "Country", "Join Date"],
        records: this.transformUserToCSVData()
      })
    },

    transformUserToCSVData(): any[] {
      const csvData: any[] = [];

      // Transform each user object into the desired format
      this.users.forEach(user => {
        const {
          objectId,
          firstName,
          middleName,
          lastName,
          phoneNumber,
          avatarUrl,
          email,
          createdAt,
        } = user;



        // Format the "Join Date" column
        const joinDate = useFormatDateHuman(new Date(createdAt))

        // Push the transformed values into the CSV data array
        csvData.push([objectId, firstName, middleName, lastName, phoneNumber, avatarUrl, email, joinDate]);
      });

      return csvData;
    }
  }
  ,
  getters: {
    hasUsers: (state) => state.apiState == ApiResponseState.SUCCESS && state.users.length > 0,
    isLoading: (state) => state.apiState == ApiResponseState.LOADING,
    failed: (state) => state.apiState == ApiResponseState.FAILED,
    success: (state) => state.apiState == ApiResponseState.SUCCESS,


    // NEW INVITE
    isInvitingNewUser: (state) => state.apiInviteNewUserState == ApiResponseState.LOADING,
    failed_InviteNewUser: (state) => state.apiInviteNewUserState == ApiResponseState.FAILED,
    success_InviteNewUser: (state) => state.apiInviteNewUserState == ApiResponseState.SUCCESS,

    isCreatingNewInviteLink: (state) => state.apiCreateNewInviteLinkState == ApiResponseState.LOADING,
    failed_CreatingNewInviteLink: (state) => state.apiCreateNewInviteLinkState == ApiResponseState.FAILED,
    success_CreatingNewInviteLink: (state) => state.apiCreateNewInviteLinkState == ApiResponseState.SUCCESS,

    // ROLE
    loading_GettingAllRoles: (state) => state.apiRoleState == ApiResponseState.LOADING,
    failed_GettingAllRoles: (state) => state.apiRoleState == ApiResponseState.FAILED,
    success_GettingAllRoles: (state) => state.apiRoleState == ApiResponseState.SUCCESS,

    // ORGANISATIONS
    loading_UserOrganisations: (state) => state.apiUserOrganisationState == ApiResponseState.LOADING,
    failed_UserOrganisations: (state) => state.apiUserOrganisationState == ApiResponseState.FAILED,
    success_UserOrganisations: (state) => state.apiUserOrganisationState == ApiResponseState.SUCCESS,
  }
})