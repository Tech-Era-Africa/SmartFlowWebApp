import { defineStore } from 'pinia'
import type { IBill, NewBillParam } from '~/server/api/bill/model/bill.model';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';

export const useBillStore = defineStore({
  id: 'billStore',
  state: () => ({
    billApiState : ApiResponseState.NULL,
    billApiFailure: {message : ""}
   }),
  actions: {

    async createNewBill(bill:NewBillParam) {
      try {
        this.billApiState = ApiResponseState.LOADING;
        const data = await useStoreFetchRequest(`https://webhook.site/255af350-755a-472a-8fa0-33af65387eab`, 'POST', bill);
        this.billApiState = ApiResponseState.SUCCESS;

      } catch (error: any) {
        this.billApiFailure.message = error.message;
        this.billApiState = ApiResponseState.FAILED;
      }
    },

    
    calculateTotalBill(consumption:number){
     const bill =  useWaterBillAlgo({ consumption : consumption ?? 0 })

     return bill.firefighting + bill.ruralWater + bill.serviceCharge + bill.waterCharge
    }
  },

  getters: {
    isCreatingBill: (state) => state.billApiState === ApiResponseState.LOADING,
    failed_CreatingBill: (state) => state.billApiState === ApiResponseState.FAILED,
    success_CreatingBill: (state) => state.billApiState === ApiResponseState.SUCCESS,

  },


})
