import { defineStore } from 'pinia'
import { useStoreFetchRequest } from '~/composables/use_store_fetch_request';
import { DeviceModel, type IDevice } from '~/server/api/device/model/device.model';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';

export const useDeviceStore = defineStore({
  id: 'deviceStore',
  state: () => ({
    // ALL DEVICE STATE
    devices : [] as IDevice[],
    selectedDevice : {} as IDevice,
    getDevicesApiState: ApiResponseState.NULL,
    getDevicesApiFailure: { message: "" },
   }),
  actions: {

    async getDevicesByUser(userId:string){
      try {
        this.getDevicesApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({userId}).toString();
        const data = await useStoreFetchRequest(`/api/device/by/user?${queryString}`, 'GET');
        this.devices = (data as any).map((data: { device: any; }) => DeviceModel.fromMap(data.device).device)
        this.getDevicesApiState = ApiResponseState.SUCCESS;

      } catch (error:any) {
        this.devices = [] //Default to empty
        this.getDevicesApiFailure.message = error.message;
        this.getDevicesApiState = ApiResponseState.FAILED;
      }
    },

    selectDevice(device:IDevice){
      this.selectedDevice = device
    }

  },

  getters: {
    hasDevices: (state) => state.getDevicesApiState === ApiResponseState.SUCCESS && state.devices.length > 0,
    isGettingDevices: (state) => state.getDevicesApiState === ApiResponseState.LOADING,
    failed_GettingDevices: (state) => state.getDevicesApiState === ApiResponseState.FAILED,
    success_GettingDevice: (state) => state.getDevicesApiState === ApiResponseState.SUCCESS,
  
  },
})
