import { defineStore } from 'pinia'
import { useStoreFetchRequest } from '~/composables/use_store_fetch_request';
import { DeviceModel, type IDevice } from '~/server/api/device/model/device.model';
import { UserModel, type User } from '~/server/api/user/model/user.model';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';

export const useDeviceStore = defineStore({
  id: 'deviceStore',
  state: () => ({
    // ALL DEVICE STATE
    devices: [] as IDevice[],
    selectedDevice: {} as IDevice,
    deviceUsers : [] as User[],
    getDevicesApiState: ApiResponseState.NULL,
    getDevicesApiFailure: { message: "" },

    deviceUsersApiState: ApiResponseState.NULL,
    deviceUsersApiFailure: { message: "" },

    // CONSUMPTION TREND STATE
    deviceConsumptionTrend: [],
    consumptionTrendsApiState: ApiResponseState.NULL,
    consumptionTrendsApiFailure: { message: "" },

    // Current consumption
    consumption : 0,
    consumptionApiState : ApiResponseState.NULL,
    consumptionApiFailure : {message : ""},

    //NEW DEVICE
    newDeviceApiState:ApiResponseState.NULL,
    newDeviceApiFailure : {message : ""},

  }),
  actions: {

    async addNewDevice(device:IDevice) {
      try {
        this.newDeviceApiState = ApiResponseState.LOADING;
        await useStoreFetchRequest('/api/device', 'POST', {device, ownerId : "95lmGWfP9C"});
        this.newDeviceApiState = ApiResponseState.SUCCESS;
        setTimeout(() => {
          this.newDeviceApiState = ApiResponseState.NULL;//Resets cos the state changes retriggering this. might need to do this better
        }, 100);

      } catch (error: any) {
        this.newDeviceApiFailure.message = error.message;
        this.newDeviceApiState = ApiResponseState.FAILED;
      }
    },

    async getDevicesByUser(userId: string) {
      try {
        this.getDevicesApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ userId }).toString();
        const data = await useStoreFetchRequest(`/api/device/by/user?${queryString}`, 'GET');
        this.devices = (data as any).map((data: { device: any; }) => DeviceModel.fromMap(data.device).device)
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

    async getCurrentDeviceConsumption(deviceId: string) {
      try {
        this.consumptionApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ deviceId }).toString();
        const data = await useStoreFetchRequest(`/api/device/consumption/current?${queryString}`, 'GET');
        this.consumption = (data as any).latestDeviceConsumption.consumption ?? 0
        this.consumptionApiState = ApiResponseState.SUCCESS;

      } catch (error: any) {
        this.consumption = 0
        this.consumptionApiFailure.message = error.message;
        this.consumptionApiState = ApiResponseState.FAILED;
      }
    },

    async getDeviceConsumptionTrend(deviceId: string, year?: number) {
      try {
        
        this.consumptionTrendsApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ deviceId, year: year?.toString() ?? '2023' }).toString();
        const data = await useStoreFetchRequest(`/api/device/consumption?${queryString}`, 'GET');

        this.consumptionTrendsApiState = ApiResponseState.SUCCESS;
        this.deviceConsumptionTrend = data as []

      } catch (error: any) {
        this.deviceConsumptionTrend = [] //Default to empty
        this.consumptionTrendsApiFailure.message = error.message;
        this.consumptionTrendsApiState = ApiResponseState.FAILED;
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

    isGettingDeviceUsers: (state) => state.deviceUsersApiState === ApiResponseState.LOADING,
    failed_DeviceUsers: (state) => state.deviceUsersApiState === ApiResponseState.FAILED,
    success_DeviceUsers: (state) => state.deviceUsersApiState === ApiResponseState.SUCCESS,
    
    isAddingNewDevice: (state) => state.newDeviceApiState === ApiResponseState.LOADING,
    failed_AddingNewDevice: (state) => state.newDeviceApiState === ApiResponseState.FAILED,
    success_AddingNewDevice: (state) => state.newDeviceApiState === ApiResponseState.SUCCESS,
  },
})
