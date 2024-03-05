import { defineStore } from 'pinia'
import { useStoreFetchRequest } from '~/composables/use_store_fetch_request';
import { DeviceModel, type IDevice } from '~/server/api/device/model/device.model';
import { UserModel, type User } from '~/server/api/auth/user/model/user.model';
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

     // Min Max consumption
     minMaxconsumption : {min : 0, max : 0},
     minMaxconsumptionApiState : ApiResponseState.NULL,
     minMaxconsumptionApiFailure : {message : ""},

    //NEW DEVICE
    newDeviceApiState:ApiResponseState.NULL,
    newDeviceApiFailure : {message : ""},

    //TOTAL CONSUMPTION ALL DEVICE BY USER
    allTotalConsumptionApiState : ApiResponseState.NULL,
    allTotalConsumptionApiFailure : {message : ""},
    allTotalConsumption : 0

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
      // Do nothing if the devices have already been fetched
      if(this.getDevicesApiState != ApiResponseState.NULL) return;

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

    async getCurrentDeviceConsumption(deviceId: string, period:string = 'M') {
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

    async getAllDeviceTotalConsumption(userId:string) {
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


    async getMonthlyMinMaxConsumption(deviceId: string) {
      try {
        this.minMaxconsumptionApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ deviceId }).toString();
        const data = await useStoreFetchRequest(`/api/device/consumption/minMax?${queryString}`, 'GET');
        console.log(data)
        this.minMaxconsumption = {
          max : (data as any).highestConsumption.value,
          min : (data as any).lowestConsumption.value
        }
        this.minMaxconsumptionApiState = ApiResponseState.SUCCESS;

      } catch (error: any) {
        this.minMaxconsumption = {
          min : 0,max : 0
        }
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
        this.deviceConsumptionTrend = (data as []).map(consumption=>parseFloat((consumption * 1000).toFixed(2))) as []

      } catch (error: any) {
        this.deviceConsumptionTrend = [] //Default to empty
        this.consumptionTrendsApiFailure.message = error.message;
        this.consumptionTrendsApiState = ApiResponseState.FAILED;
      }
    },


    async getAllDevicesConsumptionTrend(uid:string, startDate:string, endDate:string) {
      try {
        
        this.consumptionTrendsApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ uid, startDate, endDate}).toString();
        const data = await useStoreFetchRequest(`/api/device/consumption/all?${queryString}`, 'GET');

        this.consumptionTrendsApiState = ApiResponseState.SUCCESS;

        // TODO!: MUST GIVE THIS THE RIGHT TYPE
        const groupedData = (data as any).data.reduce((acc:any, entry:any) => {
          const { deviceId, consumptionChange, time } = entry;
          
          if (!acc[deviceId]) {
              acc[deviceId] = {
                  name: deviceId,
                  data: []
              };
          }
      
          acc[deviceId].data.push({ y: consumptionChange, x: time });
          return acc;
      }, {});

        this.deviceConsumptionTrend = Object.values(groupedData)

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

    isGettingDeviceMinMaxConsumption: (state) => state.minMaxconsumptionApiState === ApiResponseState.LOADING,
    failed_DeviceMinMaxConsumption: (state) => state.minMaxconsumptionApiState === ApiResponseState.FAILED,
    success_DeviceMinMaxConsumption: (state) => state.minMaxconsumptionApiState === ApiResponseState.SUCCESS,

    isGettingDeviceUsers: (state) => state.deviceUsersApiState === ApiResponseState.LOADING,
    failed_DeviceUsers: (state) => state.deviceUsersApiState === ApiResponseState.FAILED,
    success_DeviceUsers: (state) => state.deviceUsersApiState === ApiResponseState.SUCCESS,
    
    isAddingNewDevice: (state) => state.newDeviceApiState === ApiResponseState.LOADING,
    failed_AddingNewDevice: (state) => state.newDeviceApiState === ApiResponseState.FAILED,
    success_AddingNewDevice: (state) => state.newDeviceApiState === ApiResponseState.SUCCESS,


    loading_AllTotalConsumption: (state) => state.allTotalConsumptionApiState === ApiResponseState.LOADING,
    failed_AllTotalConsumption: (state) => state.allTotalConsumptionApiState === ApiResponseState.FAILED,
    success_AllTotalConsumption: (state) => state.allTotalConsumptionApiState === ApiResponseState.SUCCESS,
  },
})
