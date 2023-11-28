import { defineStore } from 'pinia'
import type { IBill, IBillOption} from '~/server/api/bill/model/bill.model';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';

export const useBillStore = defineStore({
  id: 'billStore',
  state: () => ({
    billApiState : ApiResponseState.NULL,
    billApiFailure: {message : ""},
    createdBill : {} as IBill,

    // GET BILL
    fetchBillApiState : ApiResponseState.NULL,
    fetchBillApiFailure : {message : ""},
    bill : {} as IBillOption
   }),
  actions: {

    async createNewBill(bill:IBillOption) {
      try {
        this.billApiState = ApiResponseState.LOADING;
        const data = await useStoreFetchRequest("/api/bill", 'POST', bill);
        this.billApiState = ApiResponseState.SUCCESS;
        this.createdBill = data as any;
        console.log("Success generating bill: ", data)

      } catch (error: any) {
        console.log(error)
        this.billApiFailure.message = error.message;
        this.billApiState = ApiResponseState.FAILED;
      }
    },

    async getBillWithDevice(billId:string) {
      try {
        if(!billId) throw Error("Bill id required")

        this.fetchBillApiState = ApiResponseState.LOADING;
        const data:any = await useStoreFetchRequest(`/api/bill/${billId}`, 'GET');

        // Throw error exception
        if(!data.success) throw data.error

        this.fetchBillApiState = ApiResponseState.SUCCESS;
        this.bill = data.data

      } catch (error: any) {
        this.fetchBillApiFailure.message = error.message;
        this.fetchBillApiState = ApiResponseState.FAILED;
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

    isFetchingBill: (state) => state.fetchBillApiState === ApiResponseState.LOADING,
    failed_FetchingBill: (state) => state.fetchBillApiState === ApiResponseState.FAILED,
    success_FetchingBill: (state) => state.fetchBillApiState === ApiResponseState.SUCCESS,
    hasBill : (state) => state.fetchBillApiState === ApiResponseState.SUCCESS && state.bill,

  },


})
