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

    // Current consumption
    consumption: 0,
    consumptionApiState: ApiResponseState.NULL,
    consumptionApiFailure: { message: "" },

    // Min Max consumption
    minMaxconsumption: { min: 0, max: 0, sum: 0 },
    minMaxconsumptionApiState: ApiResponseState.NULL,
    minMaxconsumptionApiFailure: { message: "" },

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

     //TOTAL CONSUMPTION BY CLUSTER
     totalConsumptionByClusterApiState: ApiResponseState.NULL,
     totalConsumptionByClusterApiFailure: { message: "" },
     summaryClusterConsumptionTrend : [],

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
        const data = await useStoreFetchRequest('/api/device', 'POST', { device, ownerId: useUserStore().currentUser?.objectId!, orgId: useUserStore().currentUser?.orgId, clusterId });
        this.newDeviceApiState = ApiResponseState.SUCCESS;
        console.log(data)
        setTimeout(() => {
          this.newDeviceApiState = ApiResponseState.NULL;//Resets cos the state changes retriggering this. might need to do this better
        }, 100);

      } catch (error: any) {
        this.newDeviceApiFailure.message = error.message;
        this.newDeviceApiState = ApiResponseState.FAILED;
      }
    },

    async addNewDeviceCluster(name: string) {
      try {
        this.newClusterApiState = ApiResponseState.LOADING;
        // TODO!: MAKE ORG DYNAMIC
        const data = await useStoreFetchRequest('/api/device/cluster', 'POST', { name, createdBy: useUserStore().currentUser?.objectId!, orgId: useUserStore().currentUser?.orgId });
        this.newClusterApiState = ApiResponseState.SUCCESS;
        this.devicesGroups.push(DeviceGroupModel.fromMap({
          userDeviceGroup: data,
          devicesCount: 0
        }))

        // Reset
        setTimeout(() => {
          this.newClusterApiState = ApiResponseState.NULL;
        }, 500);

      } catch (error: any) {
        this.newClusterApiFailure.message = error.message;
        this.newClusterApiState = ApiResponseState.FAILED;
      }
    },

    async getUserDeviceGroup() {
      try {

        this.devicesGroupApiState = ApiResponseState.LOADING;

        const data = await useStoreFetchRequest(`/api/device/group/${useUserStore().currentUser?.objectId!}`, 'GET');

        this.devicesGroupApiState = ApiResponseState.SUCCESS;
        this.devicesGroups = (data as []).map(deviceGroup => DeviceGroupModel.fromMap(deviceGroup))

      } catch (error: any) {
        this.devicesGroups = [] //Default to empty
        this.devicesGroupApiFailure.message = error.message;
        this.devicesGroupApiState = ApiResponseState.FAILED;
      }
    },

    async getDevicesByUser(userId: string) {
      // Do nothing if the devices have already been fetched
      if (this.getDevicesApiState != ApiResponseState.NULL) return;

      try {
        this.getDevicesApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ userId }).toString();
        const data = await useStoreFetchRequest(`/api/device/by/user?${queryString}`, 'GET');
        this.devices = (data as any).map((data: { device: any; }) => DeviceModel.fromMap(data.device))
        this.getDevicesApiState = ApiResponseState.SUCCESS;

      } catch (error: any) {
        this.devices = [] //Default to empty
        this.getDevicesApiFailure.message = error.message;
        this.getDevicesApiState = ApiResponseState.FAILED;
      }
    },


    async getDevicesByGroup(groupId: string) {

      try {
        this.getDevicesApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ groupId }).toString();
        const data = await useStoreFetchRequest(`/api/device/by/group?${queryString}`, 'GET');
        this.devices = (data as any).groupDevices.map((data: { device: any; }) => DeviceModel.fromMap(data.device))
        this.deviceGroupName = (data as any).groupName;
        this.getDevicesApiState = ApiResponseState.SUCCESS;

      } catch (error: any) {
        this.devices = [] //Default to empty
        this.getDevicesApiFailure.message = error.message;
        this.getDevicesApiState = ApiResponseState.FAILED;
      }
    },

    async getDevicesByOrg() {

      try {
        this.getDevicesApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ id: "hXR7sQI3FI" }).toString(); //TODO!: Must dynamically pass this
        const data = await useStoreFetchRequest(`/api/device/by/org?${queryString}`, 'GET');
        this.devices = (data as any).map((data: any) => DeviceModel.fromMap(data))
        this.getDevicesApiState = ApiResponseState.SUCCESS;

      } catch (error: any) {
        this.devices = [] //Default to empty
        this.getDevicesApiFailure.message = error.message;
        this.getDevicesApiState = ApiResponseState.FAILED;
      }
    },

    async getDeviceUsers(deviceId: string) {
      try {
        this.deviceUsersApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ deviceId }).toString();
        const data = await useStoreFetchRequest(`/api/device/users?${queryString}`, 'GET');
        this.deviceUsers = (data as any).users.map((data: { user: any; }) => UserModel.default().user)
        this.deviceUsersApiState = ApiResponseState.SUCCESS;

      } catch (error: any) {
        this.deviceUsers = [] //Default to empty
        this.deviceUsersApiFailure.message = error.message;
        this.deviceUsersApiState = ApiResponseState.FAILED;
      }
    },

    async getCurrentDeviceConsumption(deviceId: string, period: string = 'M') {
      try {
        this.consumptionApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ deviceId, period }).toString();
        const data = await useStoreFetchRequest(`/api/device/consumption/period?${queryString}`, 'GET');
        this.consumption = (data as any).totalConsumption ?? 0
        this.consumptionApiState = ApiResponseState.SUCCESS;

      } catch (error: any) {
        this.consumption = 0
        this.consumptionApiFailure.message = error.message;
        this.consumptionApiState = ApiResponseState.FAILED;
      }
    },

    async getAllDeviceTotalConsumption(userId: string) {
      try {
        this.allTotalConsumptionApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ userId }).toString();
        const data = await useStoreFetchRequest(`/api/device/consumption/by/user/total?${queryString}`, 'GET');
        this.allTotalConsumption = (data as any).totalConsumption ?? 0
        this.allTotalConsumptionApiState = ApiResponseState.SUCCESS;

      } catch (error: any) {
        this.allTotalConsumption = 0
        this.allTotalConsumptionApiFailure.message = error.message;
        this.allTotalConsumptionApiState = ApiResponseState.FAILED;
      }
    },


    async getMonthlyMinMaxConsumption(startDate: string, endDate: string) {
      try {

        this.minMaxconsumptionApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ uid: useUserStore().currentUser?.objectId!, startDate, endDate }).toString();
        const data = await useStoreFetchRequest(`/api/device/consumption/sumAll?${queryString}`, 'GET');

        this.minMaxconsumptionApiState = ApiResponseState.SUCCESS;

        // Assign data once successful
        if ((data as any).success) {
          this.minMaxconsumption = {
            max: (data as any).data[0].max_consumption_change,
            min: (data as any).data[0].min_consumption_change,
            sum: (data as any).data[0].sum_consumption_change
          }
        }


      } catch (error: any) {
        this.minMaxconsumptionApiFailure.message = error.message;
        this.minMaxconsumptionApiState = ApiResponseState.FAILED;
      }
    },



    async getDeviceConsumptionTrend(deviceId: string, year?: number) {
      try {

        this.consumptionTrendsApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ deviceId, year: year?.toString() ?? new Date(Date.now()).getFullYear().toString() }).toString();
        const data = await useStoreFetchRequest(`/api/device/consumption?${queryString}`, 'GET');

        this.consumptionTrendsApiState = ApiResponseState.SUCCESS;
        this.deviceConsumptionTrend = (data as []).map(consumption => parseFloat((consumption * 1000).toFixed(2))) as []

      } catch (error: any) {
        this.deviceConsumptionTrend = [] //Default to empty
        this.consumptionTrendsApiFailure.message = error.message;
        this.consumptionTrendsApiState = ApiResponseState.FAILED;
      }
    },


    async getAllDevicesConsumptionTrend(startDate: string, endDate: string) {
      try {

        this.consumptionTrendsApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ uid: useUserStore().currentUser?.objectId!, startDate, endDate }).toString();
        const data = await useStoreFetchRequest(`/api/device/consumption/all?${queryString}`, 'GET');

        this.consumptionTrendsApiState = ApiResponseState.SUCCESS;

        // TODO!: MUST GIVE THIS THE RIGHT TYPE
        const groupedData = (data as any).data.reduce((acc: any, entry: any) => {
          const { date_bin } = entry;

          // Iterate over the keys in the entry
          Object.keys(entry).forEach((key: string) => {
            // Exclude the date_bin key
            if (key !== 'date_bin') {
              // If the key doesn't exist in the accumulator, create it
              if (!acc[key]) {
                acc[key] = {
                  name: key,
                  data: []
                };
              }

              // Push the consumption data to the corresponding key in the accumulator
              acc[key].data.push({
                x: date_bin,
                y : entry[key]
              });
            }
          });
          return acc;
        }, {});

        this.deviceConsumptionTrend = Object.values(groupedData)

      } catch (error: any) {
        this.deviceConsumptionTrend = [] //Default to empty
        this.consumptionTrendsApiFailure.message = error.message;
        this.consumptionTrendsApiState = ApiResponseState.FAILED;
      }
    },

    async getDeviceSummaryConsumptionTrend(startDate: string, endDate: string) {
      try {

        this.totalConsumptionByClusterApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ id: "C123", startDate, endDate }).toString(); //TODO!: MAKE MORE DYNAMIC
        const data = await useStoreFetchRequest(`/api/device/consumption/by/cluster?${queryString}`, 'GET');

        this.totalConsumptionByClusterApiState = ApiResponseState.SUCCESS;

        // TODO!: MUST GIVE THIS THE RIGHT TYPE
        const groupedData = (data as any).data.reduce((acc: any, entry: any) => {
          const { date_bin } = entry;

          // Iterate over the keys in the entry
          Object.keys(entry).forEach((key: string) => {
            // Exclude the date_bin key
            if (key !== 'date_bin') {
              // If the key doesn't exist in the accumulator, create it
              if (!acc[key]) {
                acc[key] = {
                  name: key,
                  data: []
                };
              }

              // Push the consumption data to the corresponding key in the accumulator
              acc[key].data.push({
                x: date_bin,
                y : entry[key]
              });
            }
          });
          return acc;
        }, {});

        this.summaryClusterConsumptionTrend =  Object.values(groupedData)

      } catch (error: any) {
        this.totalConsumptionByClusterApiFailure.message = error.message;
        this.totalConsumptionByClusterApiState = ApiResponseState.FAILED;
        this.summaryClusterConsumptionTrend = []
      }
    },


    async selectDevice(device: IDevice) {
      this.selectedDevice = device

      // Get the consumption trend data
      this.getDeviceConsumptionTrend(device.objectId)

      // Get the current consumption
      this.getCurrentDeviceConsumption(device.objectId)

      // Get device users
      this.getDeviceUsers(device.objectId)
    },

    filterActiveDevices() {
      return this.devices.filter((device) => device.status == "heWFtvGqhO")
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

    isGettingDeviceConsumption: (state) => state.consumptionApiState === ApiResponseState.LOADING,
    failed_DeviceConsumption: (state) => state.consumptionApiState === ApiResponseState.FAILED,
    success_DeviceConsumption: (state) => state.consumptionApiState === ApiResponseState.SUCCESS,

    isGettingDeviceMinMaxConsumption: (state) => state.minMaxconsumptionApiState === ApiResponseState.LOADING,
    failed_DeviceMinMaxConsumption: (state) => state.minMaxconsumptionApiState === ApiResponseState.FAILED,
    success_DeviceMinMaxConsumption: (state) => state.minMaxconsumptionApiState === ApiResponseState.SUCCESS,

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

    loading_TotalConsumptionByCluster: (state) => state.totalConsumptionByClusterApiState === ApiResponseState.LOADING,
    failed_TotalConsumptionByCluster: (state) => state.totalConsumptionByClusterApiState === ApiResponseState.FAILED,
    success_TotalConsumptionByCluster: (state) => state.totalConsumptionByClusterApiState === ApiResponseState.SUCCESS,


    loading_DevicesGroup: (state) => state.devicesGroupApiState === ApiResponseState.LOADING,
    failed_DevicesGroup: (state) => state.devicesGroupApiState === ApiResponseState.FAILED,
    success_DevicesGroup: (state) => state.devicesGroupApiState === ApiResponseState.SUCCESS,
    hasGroupDevices: (state) => state.devicesGroupApiState === ApiResponseState.SUCCESS && state.devicesGroups.length > 0,
  },
})
