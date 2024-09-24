import { defineStore } from 'pinia'
import { useUserStore } from '../auth/user/user.store';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';
import { DeviceGroupModel, type IDeviceGroup } from '~/stores/device/model/deviceGroup.model';

export const useClusterStore = defineStore('cluster', {
    state: () => ({
        newClusterApiState: ApiResponseState.NULL,
        newClusterApiFailure: { message: "" },
        devicesGroups: [] as IDeviceGroup[],
    }),

    actions: {
        async createNewCluster(name: string): Promise<void> {
            try {
                this.newClusterApiState = ApiResponseState.LOADING;
                await $fetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/cluster`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${useUserStore().token}`
                    },
                    body: {
                        name,
                        createdBy: useUserStore().currentUser?.objectId!,
                        orgId: useUserStore().selectedOrganisation.objectId
                    }
                });

                this.newClusterApiState = ApiResponseState.SUCCESS;

                // Reset state after a short delay
                setTimeout(() => {
                    this.newClusterApiState = ApiResponseState.NULL;
                }, 500);

            } catch (error: any) {
                this.newClusterApiFailure.message = error.message;
                this.newClusterApiState = ApiResponseState.FAILED;
                throw error; // Re-throw the error for the caller to handle if needed
            }
        },

       
    },
    getters: {
        isAddingNewCluster: (state) => state.newClusterApiState === ApiResponseState.LOADING,
        failed_AddingNewCluster: (state) => state.newClusterApiState === ApiResponseState.FAILED,
        success_AddingNewCluster: (state) => state.newClusterApiState === ApiResponseState.SUCCESS,
    },
})
