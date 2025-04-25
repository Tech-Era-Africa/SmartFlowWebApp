import { defineStore } from 'pinia'
import { useStoreFetchRequest } from '~/composables/use_store_fetch_request';
import { DeviceModel, type IDevice } from '~/stores/device/model/device.model';
import { UserModel, type User } from '~/stores/auth/user/model/user.model';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';
import { useUserStore } from '../auth/user/user.store';

export interface ClusterDeviceResponse {
    imei: string;
    createdAt: string;
    updatedAt: string;
    lastAt: string;
    expireAt: string;
    name: string;
    deviceId: string;
    consumptionReading: number;
    priority: string;
    description: string;
    clusterInfo?: {
        id: number;
        name: string;
    };
}

interface ClusterDevicesApiResponse {
    data: ClusterDeviceResponse[];
    page: number;
    limit: number;
    count: number;
}


export const useDeviceStore = defineStore({
  id: 'deviceStore',
  state: () => ({
    // ALL DEVICE STATE
    devices: [] as IDevice[],
    selectedDevice: {} as IDevice,
    deviceUsers: [] as User[],
    getDevicesApiState: ApiResponseState.NULL,
    getDevicesApiFailure: { message: "" },
  }),
  actions: {
    async addNewDevice(device: IDevice, clusterId: string) {
      try {
        const data = await useStoreFetchRequest('/api/device', 'POST', {
          device,
          ownerId: useUserStore().currentUser?.id!,
          orgId: "",//FIXME: MAKE THIS DYNAMIC
          clusterId
        });
 
        return data;
      } catch (error: any) {
        throw error;
      }
    },


    async getClusterDevices(id: string) {
      return new Promise<ClusterDeviceResponse[]>(async (resolve, reject) => {
        try {
          const { data, error } = await useFetch<ClusterDevicesApiResponse>(`${useRuntimeConfig().public.API_BASE_URL}/devices/cluster`, {
            method: 'GET',
            query: {
              "filter[clusterId]": id
            },
            headers: {
              "Authorization": `Bearer ${useUserStore().token}`
            }
          });

          // Handle errors
          if (error?.value) {
            throw new Error(error.value.data?.error || 'Failed to fetch devices');
          }

          // Extract the devices array from the response
          const responseData = data.value;
          if (!responseData || !responseData.data) {
            return resolve([]);
          }

          return resolve(responseData.data);
        } catch (error: any) {
          console.error('Error fetching cluster devices:', error);
          return reject(error);
        }
      });
    },

  },


});