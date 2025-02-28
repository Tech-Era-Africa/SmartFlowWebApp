import { defineStore } from 'pinia'
import { useStoreFetchRequest } from '~/composables/use_store_fetch_request';
import { DeviceModel, type IDevice } from '~/stores/device/model/device.model';
import { UserModel, type User } from '~/stores/auth/user/model/user.model';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';
import { useUserStore } from '../auth/user/user.store';
import { DeviceGroupModel, type IDeviceGroup } from '~/stores/device/model/deviceGroup.model';

export const useDeviceStore = defineStore({
  id: 'deviceStore',
  state: () => ({
    // ALL DEVICE STATE
    devices: [] as IDevice[],
    selectedDevice: {} as IDevice,
    deviceUsers: [] as User[],
    getDevicesApiState: ApiResponseState.NULL,
    getDevicesApiFailure: { message: "" },

    deviceUsersApiState: ApiResponseState.NULL,
    deviceUsersApiFailure: { message: "" },

    // CONSUMPTION TREND STATE
    deviceConsumptionTrend: [],
    consumptionTrendsApiState: ApiResponseState.NULL,
    consumptionTrendsApiFailure: { message: "" },

     // CONSUMPTION TREND GROUPED STATE
     consumptionGrouped: [] as { name: string, data: { x: string, y: number, downtime: number }[] }[],
     consumptionGroupedApiState: ApiResponseState.NULL,
     consumptionGroupedApiFailure: { message: "" },

    // SELECTED DEVICE CONSUMPTION TREND STATE
    selectedDeviceConsumptionTrend: [],
    selectedDeviceConsumptionTrendsApiState: ApiResponseState.NULL,
    selectedDeviceConsumptionTrendsApiFailure: { message: "" },

    // Current consumption
    consumption: 0,
    consumptionApiState: ApiResponseState.NULL,
    consumptionApiFailure: { message: "" },

    // Min Max consumption
    minMaxconsumption: { min: 0, max: 0, sum: 0 },
    minMaxconsumptionApiState: ApiResponseState.NULL,
    minMaxconsumptionApiFailure: { message: "" },

    // Selected Device Min Max consumption
    selectedDeviceMinMaxConsumption: { min: 0, max: 0, sum: 0 },
    selectedDeviceMinMaxConsumptionApiState: ApiResponseState.NULL,
    selectedDeviceMinMaxConsumptionApiFailure: { message: "" },

    //TOTAL CONSUMPTION BY CLUSTER
    totalClusterConsumption: { sum: 0 },
    totalClusterConsumptionApiState: ApiResponseState.NULL,
    totalClusterConsumptionApiFailure: { message: "" },
    clusterConsumptionTrend: [],

    //NEW DEVICE
    newDeviceApiState: ApiResponseState.NULL,
    newDeviceApiFailure: { message: "" },

    //NEW DEVICE CLUSTER
    newClusterApiState: ApiResponseState.NULL,
    newClusterApiFailure: { message: "" },

    //TOTAL CONSUMPTION ALL DEVICE BY USER
    allTotalConsumptionApiState: ApiResponseState.NULL,
    allTotalConsumptionApiFailure: { message: "" },
    allTotalConsumption: 0,

    //DEVICES GROUP BY USER
    devicesGroupApiState: ApiResponseState.NULL,
    devicesGroupApiFailure: { message: "" },
    devicesGroups: [] as IDeviceGroup[],
    deviceGroupName: "",
  }),
  actions: {
    async addNewDevice(device: IDevice, clusterId: string) {
      try {
        this.newDeviceApiState = ApiResponseState.LOADING;
        const data = await useStoreFetchRequest('/api/device', 'POST', { 
          device, 
          ownerId: useUserStore().currentUser?.id!, 
          orgId: useUserStore().selectedOrganisation.objectId, 
          clusterId 
        });
        
        this.newDeviceApiState = ApiResponseState.SUCCESS;
        console.log(data);
        
        // Use a more reliable approach for state reset
        setTimeout(() => {
          this.newDeviceApiState = ApiResponseState.NULL;
        }, 100);
      } catch (error: any) {
        this.newDeviceApiFailure.message = error.message;
        this.newDeviceApiState = ApiResponseState.FAILED;
      }
    },

    async getUserDeviceGroup() {
      try {
        this.devicesGroupApiState = ApiResponseState.LOADING;
        const data = await useStoreFetchRequest(`/api/device/group/${useUserStore().currentUser?.id!}`, 'GET');
        this.devicesGroupApiState = ApiResponseState.SUCCESS;
        this.devicesGroups = (data as []).map(deviceGroup => DeviceGroupModel.fromMap(deviceGroup));
      } catch (error: any) {
        this.devicesGroups = []; // Default to empty
        this.devicesGroupApiFailure.message = error.message;
        this.devicesGroupApiState = ApiResponseState.FAILED;
      }
    },

    async getOrgDeviceGroup() {
      return new Promise<IDeviceGroup[]>(async (resolve, reject) => {
        try {
          this.devicesGroupApiState = ApiResponseState.LOADING;
          
          const data = await $fetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/device/group/by/org`, {
            method: 'GET',
            query: {
              id: useUserStore().selectedOrganisation.objectId
            },
            headers: {
              "Authorization": `Bearer ${useUserStore().token}`
            }
          });

          this.devicesGroupApiState = ApiResponseState.SUCCESS;
          this.devicesGroups = ((data as any) as IDeviceGroup[]).map(deviceGroup => DeviceGroupModel.fromMap(deviceGroup));

          return resolve(this.devicesGroups);
        } catch (error: any) {
          this.devicesGroups = []; // Default to empty
          this.devicesGroupApiFailure.message = error.message;
          this.devicesGroupApiState = ApiResponseState.FAILED;
          reject(error);
        }
      });
    },

    async getDevicesByUser(userId: string) {
      // Do nothing if the devices have already been fetched
      if (this.getDevicesApiState != ApiResponseState.NULL) return;

      try {
        this.getDevicesApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ userId }).toString();
        const data = await useStoreFetchRequest(`/api/device/by/user?${queryString}`, 'GET');
        this.devices = (data as any).map((data: { device: any; }) => DeviceModel.fromMap(data.device));
        this.getDevicesApiState = ApiResponseState.SUCCESS;
      } catch (error: any) {
        this.devices = []; // Default to empty
        this.getDevicesApiFailure.message = error.message;
        this.getDevicesApiState = ApiResponseState.FAILED;
      }
    },

    async getDevicesByGroup(groupId: string) {
      return new Promise<IDevice[]>(async (resolve, reject) => {
        try {
          this.getDevicesApiState = ApiResponseState.LOADING;

          const { data, error } = await useFetch(`${useRuntimeConfig().public.API_BASE_URL}/device/by/group`, {
            method: 'GET',
            query: {
              id: groupId
            },
            headers: {
              "Authorization": `Bearer ${useUserStore().token}`
            }
          });

          // Handle errors
          if (error?.value) {
            this.getDevicesApiState = ApiResponseState.FAILED;
            this.getDevicesApiFailure.message = error.value.data?.error || 'Failed to fetch devices';
            this.devices = [];
            return reject(error.value);
          }

          this.devices = (data.value as any).groupDevices.map((data: { device: any; }) => DeviceModel.fromMap(data.device));
          this.deviceGroupName = (data.value as any).groupName;
          this.getDevicesApiState = ApiResponseState.SUCCESS;

          return resolve(this.devices);
        } catch (error: any) {
          this.devices = []; // Default to empty
          this.getDevicesApiFailure.message = error.message;
          this.getDevicesApiState = ApiResponseState.FAILED;
          return reject(error);
        }
      });
    },

    async getDevicesByOrg() {
      return new Promise<IDevice[]>(async (resolve, reject) => {
        try {
          this.getDevicesApiState = ApiResponseState.LOADING;

          const { data, error } = await useFetch(`${useRuntimeConfig().public.API_BASE_URL}/device/by/org`, {
            method: 'GET',
            query: {
              id: useUserStore().selectedOrganisation.objectId
            },
            headers: {
              "Authorization": `Bearer ${useUserStore().token}`
            }
          });

          // Handle errors
          if (error?.value) {
            this.getDevicesApiState = ApiResponseState.FAILED;
            this.getDevicesApiFailure.message = error.value.data?.error || 'Failed to fetch devices';
            this.devices = [];
            return reject(error.value);
          }

          this.devices = (data.value as any).map((data: any) => DeviceModel.fromMap(data));
          this.getDevicesApiState = ApiResponseState.SUCCESS;

          return resolve(this.devices);
        } catch (error: any) {
          this.devices = []; // Default to empty
          this.getDevicesApiFailure.message = error.message;
          this.getDevicesApiState = ApiResponseState.FAILED;
          return reject(error);
        }
      });
    },

    async getDeviceUsers(deviceId: string) {
      try {
        this.deviceUsersApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ deviceId }).toString();
        const data = await useStoreFetchRequest(`/api/device/users?${queryString}`, 'GET');
        
        if ((data as any).users && Array.isArray((data as any).users)) {
          this.deviceUsers = (data as any).users.map((data: { user: any; }) => UserModel.fromMap(data.user));
          this.deviceUsersApiState = ApiResponseState.SUCCESS;
        } else {
          throw new Error('Invalid response format for device users');
        }
      } catch (error: any) {
        this.deviceUsers = []; // Default to empty
        this.deviceUsersApiFailure.message = error.message;
        this.deviceUsersApiState = ApiResponseState.FAILED;
      }
    },

    async getCurrentDeviceConsumption(deviceId: string, period: string = 'M') {
      try {
        this.consumptionApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ deviceId, period }).toString();
        const data = await useStoreFetchRequest(`/api/device/consumption/period?${queryString}`, 'GET');
        this.consumption = (data as any).totalConsumption ?? 0;
        this.consumptionApiState = ApiResponseState.SUCCESS;
      } catch (error: any) {
        this.consumption = 0;
        this.consumptionApiFailure.message = error.message;
        this.consumptionApiState = ApiResponseState.FAILED;
      }
    },

    async getAllDeviceTotalConsumption(userId: string) {
      try {
        this.allTotalConsumptionApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ userId }).toString();
        const data = await useStoreFetchRequest(`/api/device/consumption/by/user/total?${queryString}`, 'GET');
        this.allTotalConsumption = (data as any).totalConsumption ?? 0;
        this.allTotalConsumptionApiState = ApiResponseState.SUCCESS;
      } catch (error: any) {
        this.allTotalConsumption = 0;
        this.allTotalConsumptionApiFailure.message = error.message;
        this.allTotalConsumptionApiState = ApiResponseState.FAILED;
      }
    },

    async getMinMaxConsumption(startDate: string, endDate: string) {
      try {
        this.minMaxconsumptionApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ 
          id: useUserStore().selectedOrganisation.objectId, 
          startDate, 
          endDate 
        }).toString();
        
        const data = await useStoreFetchRequest(`/api/device/consumption/by/org?${queryString}`, 'GET');
        this.minMaxconsumptionApiState = ApiResponseState.SUCCESS;

        // Assign data once successful
        if ((data as any).success) {
          this.minMaxconsumption = {
            max: (data as any).data[0].max_consumption_change,
            min: (data as any).data[0].min_consumption_change,
            sum: (data as any).data[0].sum_consumption_change
          };
        }
      } catch (error: any) {
        this.minMaxconsumptionApiFailure.message = error.message;
        this.minMaxconsumptionApiState = ApiResponseState.FAILED;
      }
    },

    async getDeviceMinMaxConsumption(deviceId: string, startDate: string, endDate: string) {
      try {
        this.selectedDeviceMinMaxConsumptionApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ id: deviceId, startDate, endDate }).toString();
        const data = await useStoreFetchRequest(`/api/device/consumption/by/device/sum?${queryString}`, 'GET');
        this.selectedDeviceMinMaxConsumptionApiState = ApiResponseState.SUCCESS;

        // Assign data once successful
        if ((data as any).success) {
          this.selectedDeviceMinMaxConsumption = {
            max: (data as any).data[0].max_consumption_change,
            min: (data as any).data[0].min_consumption_change,
            sum: (data as any).data[0].sum_consumption_change
          };
        }
      } catch (error: any) {
        this.selectedDeviceMinMaxConsumptionApiFailure.message = error.message;
        this.selectedDeviceMinMaxConsumptionApiState = ApiResponseState.FAILED;
      }
    },

    async getClusterTotalConsumption(clusterId: string, startDate: string, endDate: string) {
      return new Promise<any>(async (resolve, reject) => {
        try {
          this.totalClusterConsumptionApiState = ApiResponseState.LOADING;

          const { data, error } = await useFetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/influx/consumption/sum/by/cluster`, {
            method: 'GET',
            query: {
              id: clusterId,
              startDate,
              endDate
            },
            headers: {
              "Authorization": `Bearer ${useUserStore().token}`
            }
          });

          // Handle errors
          if (error?.value) {
            this.totalClusterConsumptionApiState = ApiResponseState.FAILED;
            return reject(error.value.data.error || 'Server error! Could not fetch organisation device consumption trend data');
          }

          this.totalClusterConsumptionApiState = ApiResponseState.SUCCESS;
          this.totalClusterConsumption = {
            sum: data.value[0].total_consumption
          };

          return resolve(this.totalClusterConsumption);
        } catch (error: any) {
          this.totalClusterConsumptionApiFailure.message = error.message;
          this.totalClusterConsumptionApiState = ApiResponseState.FAILED;
          reject(error);
        }
      });
    },

    async getAllDevicesConsumptionGroupedTrend(startDate: string, endDate: string) {
      return new Promise<any[]>(async (resolve, reject) => {
        try {
          this.consumptionGroupedApiState = ApiResponseState.LOADING;

          const data = await $fetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/influx/consumption/trend/by/cluster/group`, {
            method: 'GET',
            query: {
              id: useUserStore().selectedOrganisation.objectId,
              startDate,
              endDate
            },
            headers: {
              "Authorization": `Bearer ${useUserStore().token}`
            }
          });

          this.consumptionGroupedApiState = ApiResponseState.SUCCESS;

          const groupedData = Object.entries(data).map(([key, value]) => ({
            name: key,
            data: (value as any[]).map(entry => ({
              x: entry.date_bin,
              y: entry.total_consumption_change,
              downtime: entry.downtime
            }))
          }));

          this.consumptionGrouped = groupedData;
          return resolve(this.consumptionGrouped);
        } catch (error: any) {
          this.consumptionGrouped = []; // Default to empty
          this.consumptionGroupedApiFailure.message = error.message;
          this.consumptionGroupedApiState = ApiResponseState.FAILED;
          reject(error);
        }
      });
    },

    async getAllDevicesConsumptionTrend(startDate: string, endDate: string) {
      return new Promise<any[]>(async (resolve, reject) => {
        try {
          this.consumptionTrendsApiState = ApiResponseState.LOADING;

          const data = await $fetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/influx/consumption/trend/by/org`, {
            method: 'GET',
            query: {
              id: useUserStore().selectedOrganisation.objectId,
              startDate,
              endDate
            },
            headers: {
              "Authorization": `Bearer ${useUserStore().token}`
            }
          });

          const key = "Total Consumption";
          const groupedData = {
            [key]: {
              name: key,
              data: data.map((entry: any) => ({
                x: entry.date_bin,
                y: entry.total_consumption_change,
                downtime: entry.downtime || 0
              }))
            }
          };

          this.consumptionTrendsApiState = ApiResponseState.SUCCESS;
          this.deviceConsumptionTrend = [];
          return resolve(this.deviceConsumptionTrend);
        } catch (error: any) {
          this.deviceConsumptionTrend = [];
          this.consumptionTrendsApiFailure.message = error.message;
          this.consumptionTrendsApiState = ApiResponseState.FAILED;
          reject(error);
        }
      });
    },

    async getClusterConsumptionTrend(clusterId: string, startDate: string, endDate: string): Promise<any> {
      return new Promise<any[]>(async (resolve, reject) => {
        try {
          this.totalClusterConsumptionApiState = ApiResponseState.LOADING;

          const data = await $fetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/influx/consumption/trend/by/cluster`, {
            method: 'GET',
            query: {
              id: clusterId,
              startDate,
              endDate
            },
            headers: {
              "Authorization": `Bearer ${useUserStore().token}`
            }
          });

          const key = "Total Consumption";

          // Create grouped data object
          const groupedData = data.reduce((acc: any, entry: any) => {
            const { date_bin, total_consumption_change, downtime } = entry;
            
            if (!acc[key]) {
              acc[key] = {
                name: key,
                data: []
              };
            }

            // Push the consumption data to the corresponding key in the accumulator
            acc[key].data.push({
              x: date_bin,
              y: total_consumption_change,
              downtime
            });

            return acc;
          }, {});

          this.totalClusterConsumptionApiState = ApiResponseState.SUCCESS;
          this.clusterConsumptionTrend = Object.values(groupedData);

          return resolve(this.clusterConsumptionTrend);
        } catch (error: any) {
          this.totalClusterConsumptionApiFailure.message = error.message;
          this.totalClusterConsumptionApiState = ApiResponseState.FAILED;
          this.clusterConsumptionTrend = [];

          return reject(error);
        }
      });
    },

    async getDeviceConsumptionTrend(deviceId: string, startDate: string, endDate: string): Promise<any> {
      try {
        this.selectedDeviceConsumptionTrendsApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ id: deviceId, startDate, endDate }).toString();
        const data = await useStoreFetchRequest(`/api/device/consumption/by/device?${queryString}`, 'GET');

        const key = "Total Consumption";

        // Create grouped data object
        const groupedData = (data as any).data.reduce((acc: any, entry: any) => {
          const { date_bin, total_consumption_change } = entry;
          
          if (!acc[key]) {
            acc[key] = {
              name: key,
              data: []
            };
          }

          // Push the consumption data to the corresponding key in the accumulator
          acc[key].data.push({
            x: date_bin,
            y: total_consumption_change
          });

          return acc;
        }, {});

        const consumptionTrend = Object.values(groupedData);

        this.selectedDeviceConsumptionTrendsApiState = ApiResponseState.SUCCESS;
        this.selectedDeviceConsumptionTrend = consumptionTrend as any;
        return consumptionTrend;
      } catch (error: any) {
        this.selectedDeviceConsumptionTrend = []; // Default to empty
        this.selectedDeviceConsumptionTrendsApiFailure.message = error.message;
        this.selectedDeviceConsumptionTrendsApiState = ApiResponseState.FAILED;
        return [];
      }
    },

    async selectDevice(device: IDevice) {
      this.selectedDevice = device;

      // Get the current consumption
      this.getCurrentDeviceConsumption(device.objectId);

      // Get device users
      this.getDeviceUsers(device.objectId);
    },

    filterActiveDevices() {
      return this.devices.filter((device) => device.status == "heWFtvGqhO");
    },

    sumTotalConsumptionFromDevices() {
      return this.devices.reduce((totalConsumption, device) => {
        return totalConsumption + (device.lastTotalConsumption || 0);
      }, 0);
    },

    sumTotalUsageFromDevices() {
      return this.devices.reduce((totalUsageCredit, device) => {
        return totalUsageCredit + (device.usageCredit || 0);
      }, 0);
    }
  },

  getters: {
    hasDevices: (state) => state.getDevicesApiState === ApiResponseState.SUCCESS && state.devices.length > 0,
    isGettingDevices: (state) => state.getDevicesApiState === ApiResponseState.LOADING,
    failed_GettingDevices: (state) => state.getDevicesApiState === ApiResponseState.FAILED,
    success_GettingDevice: (state) => state.getDevicesApiState === ApiResponseState.SUCCESS,

    isGettingConsumptionTrend: (state) => state.consumptionTrendsApiState === ApiResponseState.LOADING,
    failed_ConsumptionTrend: (state) => state.consumptionTrendsApiState === ApiResponseState.FAILED,
    success_ConsumptionTrend: (state) => state.consumptionTrendsApiState === ApiResponseState.SUCCESS,

    isGettingConsumptionGroupedTrend: (state) => state.consumptionGroupedApiState === ApiResponseState.LOADING,
    failed_ConsumptionGroupedTrend: (state) => state.consumptionGroupedApiState === ApiResponseState.FAILED,
    success_ConsumptionGroupedTrend: (state) => state.consumptionGroupedApiState === ApiResponseState.SUCCESS,

    loading_SelectedDeviceConsumptionTrend: (state) => state.selectedDeviceConsumptionTrendsApiState === ApiResponseState.LOADING,
    failed_SelectedDeviceConsumptionTrend: (state) => state.selectedDeviceConsumptionTrendsApiState === ApiResponseState.FAILED,
    success_SelectedDeviceConsumptionTrend: (state) => state.selectedDeviceConsumptionTrendsApiState === ApiResponseState.SUCCESS,

    isGettingDeviceConsumption: (state) => state.consumptionApiState === ApiResponseState.LOADING,
    failed_DeviceConsumption: (state) => state.consumptionApiState === ApiResponseState.FAILED,
    success_DeviceConsumption: (state) => state.consumptionApiState === ApiResponseState.SUCCESS,

    isGettingDeviceMinMaxConsumption: (state) => state.minMaxconsumptionApiState === ApiResponseState.LOADING,
    failed_DeviceMinMaxConsumption: (state) => state.minMaxconsumptionApiState === ApiResponseState.FAILED,
    success_DeviceMinMaxConsumption: (state) => state.minMaxconsumptionApiState === ApiResponseState.SUCCESS,

    loading_SelectedDeviceMinMaxConsumption: (state) => state.selectedDeviceMinMaxConsumptionApiState === ApiResponseState.LOADING,
    failed_SelectedDeviceMinMaxConsumption: (state) => state.selectedDeviceMinMaxConsumptionApiState === ApiResponseState.FAILED,
    success_SelectedDeviceMinMaxConsumption: (state) => state.selectedDeviceMinMaxConsumptionApiState === ApiResponseState.SUCCESS,

    loading_TotalClusterConsumption: (state) => state.totalClusterConsumptionApiState === ApiResponseState.LOADING,
    failed_TotalClusterConsumption: (state) => state.totalClusterConsumptionApiState === ApiResponseState.FAILED,
    success_TotalClusterConsumption: (state) => state.totalClusterConsumptionApiState === ApiResponseState.SUCCESS,

    isGettingDeviceUsers: (state) => state.deviceUsersApiState === ApiResponseState.LOADING,
    failed_DeviceUsers: (state) => state.deviceUsersApiState === ApiResponseState.FAILED,
    success_DeviceUsers: (state) => state.deviceUsersApiState === ApiResponseState.SUCCESS,

    isAddingNewDevice: (state) => state.newDeviceApiState === ApiResponseState.LOADING,
    failed_AddingNewDevice: (state) => state.newDeviceApiState === ApiResponseState.FAILED,
    success_AddingNewDevice: (state) => state.newDeviceApiState === ApiResponseState.SUCCESS,

    isAddingNewCluster: (state) => state.newClusterApiState === ApiResponseState.LOADING,
    failed_AddingNewCluster: (state) => state.newClusterApiState === ApiResponseState.FAILED,
    success_AddingNewCluster: (state) => state.newClusterApiState === ApiResponseState.SUCCESS,

    loading_AllTotalConsumption: (state) => state.allTotalConsumptionApiState === ApiResponseState.LOADING,
    failed_AllTotalConsumption: (state) => state.allTotalConsumptionApiState === ApiResponseState.FAILED,
    success_AllTotalConsumption: (state) => state.allTotalConsumptionApiState === ApiResponseState.SUCCESS,

    loading_DevicesGroup: (state) => state.devicesGroupApiState === ApiResponseState.LOADING,
    failed_DevicesGroup: (state) => state.devicesGroupApiState === ApiResponseState.FAILED,
    success_DevicesGroup: (state) => state.devicesGroupApiState === ApiResponseState.SUCCESS,
    hasGroupDevices: (state) => state.devicesGroupApiState === ApiResponseState.SUCCESS && state.devicesGroups.length > 0,
  },
});