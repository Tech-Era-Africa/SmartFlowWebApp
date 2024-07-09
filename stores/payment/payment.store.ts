import { defineStore } from 'pinia'
import type { PaymentApiResponse, PaymentDTO, ProcessBillPayment } from '~/utils/dto/payment.dto';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';

export const usePaymentStore = defineStore({
  id: 'PaymentStore',
  state: () => ({
    paymentInitApiState: ApiResponseState.NULL,
    paymentInitApiFailure: { message: "" },

    verifyTxApiState: ApiResponseState.NULL,
    verifyTxApiFailure: { message: "" },

    processBillApiState: ApiResponseState.NULL,
    processBillApiFailure: { message: "" },
  }),
  actions: {
    async initPayment(paymentOption: PaymentDTO) {
      try {

        this.paymentInitApiState = ApiResponseState.LOADING;

        // Update the callback url 
        paymentOption.callback_url = `${useRuntimeConfig().public.APP_BASE_URL}/billing/status/${paymentOption.billId}`
        paymentOption.reference = `${paymentOption.billId}${Date.now()}`

        const data: any = await useStoreFetchRequest(`https://api.paystack.co/transaction/initialize`, 'POST', paymentOption, {
          "Authorization": "Bearer sk_live_60441090c21e322edfd443aff8d065265097fc72", //TODO!: NEED TO FIGURE THIS OUT
          "Content-Type": "application/json"
        });


        this.paymentInitApiState = data.data.status ? ApiResponseState.SUCCESS : ApiResponseState.FAILED;

        return data

      } catch (error: any) {
        this.paymentInitApiFailure.message = error.message;
        this.paymentInitApiState = ApiResponseState.FAILED;
      }
    },

    async verifyPayment(paymentRef: string) {
      try{

   
        this.verifyTxApiState = ApiResponseState.LOADING;

        const data: any = await useStoreFetchRequest(`https://api.paystack.co/transaction/verify/${paymentRef}`, 'GET', null, {
          "Authorization": "Bearer sk_live_60441090c21e322edfd443aff8d065265097fc72",
          "Content-Type": "application/json"
        });
  
  
        this.verifyTxApiState = data.data.status == 'success' ? ApiResponseState.SUCCESS : ApiResponseState.FAILED;

        return data

      }
      catch(error:any){
        console.log(error)
        this.verifyTxApiFailure.message = error.message;
        this.verifyTxApiState = ApiResponseState.FAILED;
      }

    },

    async processBillPayment(option:ProcessBillPayment){
      try {
        this.processBillApiState = ApiResponseState.LOADING;
        const data = await useStoreFetchRequest("/api/bill/payment/process", 'POST', option);
        this.processBillApiState = ApiResponseState.SUCCESS;


      } catch (error: any) {
        console.log(error)
        this.processBillApiFailure.message = error.message;
        this.processBillApiState = ApiResponseState.FAILED;
      }
    },

   
  },

  getters: {
    isInitPayment: (state) => state.paymentInitApiState === ApiResponseState.LOADING,
    failed_InitPayment: (state) => state.paymentInitApiState === ApiResponseState.FAILED,
    success_InitPayment: (state) => state.paymentInitApiState === ApiResponseState.SUCCESS,

    isVerifyingPayment: (state) => state.verifyTxApiState === ApiResponseState.LOADING,
    failed_VerifyingPayment: (state) => state.verifyTxApiState === ApiResponseState.FAILED,
    success_VerifyingPayment: (state) => state.verifyTxApiState === ApiResponseState.SUCCESS,

    isProcessingBillPayment: (state) => state.processBillApiState === ApiResponseState.LOADING,
    failed_ProcessingBillPayment: (state) => state.processBillApiState === ApiResponseState.FAILED,
    success_ProcessingBillPayment: (state) => state.processBillApiState === ApiResponseState.SUCCESS,


  },
})
