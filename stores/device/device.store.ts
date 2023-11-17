import { defineStore } from 'pinia'
import { useStoreFetchRequest } from '~/composables/use_store_fetch_request';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';

export const useDeviceStore = defineStore({
  id: 'deviceStore',
  state: () => ({
    // ALL DEVICE STATE
    devices : [],
    getDevicesApiState: ApiResponseState.NULL,
    getDevicesApiFailure: { message: "" },
   }),
  actions: {

    async getDevicesByUser(){
      try {
        this.getDevicesApiState = ApiResponseState.LOADING;
    
        const data = await useStoreFetchRequest('/api/device/by/user', 'GET');
        this.devices = data as []
        this.getDevicesApiState = ApiResponseState.SUCCESS;
      } catch (error:any) {
        this.devices = [] //Default to empty
        this.getDevicesApiFailure.message = error.message;
        this.getDevicesApiState = ApiResponseState.FAILED;
      }
    }

  },

  getters: {
    hasDevices: (state) => state.getDevicesApiState === ApiResponseState.SUCCESS && state.devices.length > 0,
    isGettingDevices: (state) => state.getDevicesApiState === ApiResponseState.LOADING,
    failed_GettingDevices: (state) => state.getDevicesApiState === ApiResponseState.FAILED,
    success_GettingDevice: (state) => state.getDevicesApiState === ApiResponseState.SUCCESS,
  
  },
})
