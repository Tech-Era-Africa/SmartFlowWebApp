import { defineStore } from 'pinia'
import { useUserStore } from '../auth/user/user.store';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';
import type { ICluster } from './model/cluster.model';


export const useClusterStore = defineStore('cluster', {
    state: () => ({
        newClusterApiState: ApiResponseState.NULL,
        newClusterApiFailure: { message: "" },
        cluster: [] as ICluster[],
        getClustersApiState: ApiResponseState.NULL,
        getClustersApiFailure: { message: "" },
        clusterDevices: {} as any,
        clusterDevicesApiState: ApiResponseState.NULL,
        clusterDevicesApiFailure: { message: "" },
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
                        createdBy: useUserStore().currentUser?.id!,
                        orgId: ""
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

        async getClusters(): Promise<ICluster[]> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.getClustersApiState = ApiResponseState.LOADING;
                    const { data, error } = await useFetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/clusters`, {
                        method: 'GET',
                        headers: {
                            "Authorization": `Bearer ${useUserStore().token}`
                        }
                    });

                    if (error.value) throw error.value;

                    this.cluster = data.value;
                    this.getClustersApiState = ApiResponseState.SUCCESS;
                    resolve(this.cluster);
                } catch (error: any) {
                    this.getClustersApiFailure.message = error.message;
                    this.getClustersApiState = ApiResponseState.FAILED;
                    reject(error);
                }
            });

        },

        async getClusterDetails(clusterId: string): Promise<ICluster> {
            return new Promise(async (resolve, reject) => {
                try {

                    const { data, error } = await useFetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/clusters`, {
                        method: 'GET',
                        headers: {
                            "Authorization": `Bearer ${useUserStore().token}`
                        },
                        query: {
                            "filter[id]": clusterId
                        }
                    });

                    if (error.value) throw error.value;

                    if(data.value.length == 0) throw Error("Cluster not found")

                    return resolve(data.value[0]);
                } catch (error: any) {
                    return reject(error);
                }
            });
        },

    
    }, 

    

    getters: {
        isAddingNewCluster: (state) => state.newClusterApiState === ApiResponseState.LOADING,
        failed_AddingNewCluster: (state) => state.newClusterApiState === ApiResponseState.FAILED,
        success_AddingNewCluster: (state) => state.newClusterApiState === ApiResponseState.SUCCESS,
        
        isLoadingClusters: (state) => state.getClustersApiState === ApiResponseState.LOADING,
        failed_LoadingClusters: (state) => state.getClustersApiState === ApiResponseState.FAILED,
        success_LoadingClusters: (state) => state.getClustersApiState === ApiResponseState.SUCCESS,
        hasClusters: (state) => state.getClustersApiState === ApiResponseState.SUCCESS && state.cluster.length > 0,

        isLoadingClusterDevices: (state) => state.clusterDevicesApiState === ApiResponseState.LOADING,
        failed_LoadingClusterDevices: (state) => state.clusterDevicesApiState === ApiResponseState.FAILED,
        success_LoadingClusterDevices: (state) => state.clusterDevicesApiState === ApiResponseState.SUCCESS,
        hasClusterDevices: (state) => state.clusterDevicesApiState === ApiResponseState.SUCCESS && state.clusterDevices.length > 0,
    },
})
