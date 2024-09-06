import { defineStore } from 'pinia'
import { BillModel, type IBill, type IBillOption } from '~/stores/bill/model/bill.model';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';
import { useUserStore } from '../auth/user/user.store';

export const useBillStore = defineStore({
  id: 'billStore',
  state: () => ({
    billApiState: ApiResponseState.NULL,
    billApiFailure: { message: "" },
    createdBill: {} as IBill,

    // ACCOUNT CREDITS
    accountCredit: 0,
    accountCreditState: ApiResponseState.NULL,
    accountCreditFailure: { message: "" },

    // GET BILL
    fetchBillApiState: ApiResponseState.NULL,
    fetchBillApiFailure: { message: "" },
    bill: {} as IBill,

    // PAID BILL
    paidBillApiState: ApiResponseState.NULL,
    paidBillApiFailure: { message: "" },
    paidBills: [],

    // TOTAL BILLING
    totalBillingApiState: ApiResponseState.NULL,
    totalBilling: 0,
    totalBillingFailure: { message: "" },

    // BILLING WIDGET
    billingWidget:{
      billTitle: "Bill",
      billTypeId : "rxc51QYu7l", //Defaults to commercial TODO!: MAKE DYNAMIC
      devices: [] as any[],
      clusterId : "",
      totalConsumption: 0,
      startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(),
      endDate: new Date(new Date().getFullYear(), 11, 31).toISOString(),
  }
  }),
  actions: {

    async createNewBill(billOption: IBillOption) {
      try {
        this.billApiState = ApiResponseState.LOADING;

        // Update eith essential data
        billOption.bill.orgId = useUserStore().organisations[0].objectId //Organisation
        billOption.bill.createdBy = useUserStore().currentUser!.objectId //Current user
        billOption.bill.status = "h9Eb9xqyjq" //Defaults to unpaid

        const data = await useStoreFetchRequest("/api/bill", 'POST', billOption);
        this.billApiState = ApiResponseState.SUCCESS;
        this.createdBill = data as any;
        
      } catch (error: any) {
        this.billApiFailure.message = error.message;
        this.billApiState = ApiResponseState.FAILED;
      }

    },

    async getAccountCredit() {
      try {

        this.accountCreditState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ id: useUserStore().organisations[0].objectId }).toString();
        const data = await useStoreFetchRequest(`/api/credit/by/org?${queryString}`, 'GET');

        this.accountCreditState = ApiResponseState.SUCCESS;
        this.accountCredit = data as any;

      } catch (error: any) {
        this.accountCreditFailure.message = error.message;
        this.accountCreditState = ApiResponseState.FAILED;
      }
    },

    // TODO!: DO THIS PROPERLY
    async updateBillData(billData:any){
      this.billingWidget = billData
    },

    // !DEPRECATED
    async getBillWithDevice(billId: string) {
      try {
        if (!billId) throw Error("Bill id required")

        this.fetchBillApiState = ApiResponseState.LOADING;
        const data: any = await useStoreFetchRequest(`/api/bill/${billId}`, 'GET');

        // Throw error exception
        if (!data.success) throw data.error

        this.fetchBillApiState = ApiResponseState.SUCCESS;
        this.bill = data.data

      } catch (error: any) {
        this.fetchBillApiFailure.message = error.message;
        this.fetchBillApiState = ApiResponseState.FAILED;
      }
    },

    async getBillInvoice(billId: string) {
      try {
        if (!billId) throw Error("Bill id required")

        this.fetchBillApiState = ApiResponseState.LOADING;
        
        const data: any = await useStoreFetchRequest(`/api/bill/${billId}`, 'GET');

        // Throw error exception
        if (!data.success) throw data.error

        console.log(data.data)

        this.fetchBillApiState = ApiResponseState.SUCCESS;
        this.bill = BillModel.fromMap(data.data)

     

      } catch (error: any) {
        console.log(error)
        this.fetchBillApiFailure.message = error.message;
        this.fetchBillApiState = ApiResponseState.FAILED;
      }
    },

    async getCurrentPaidBills(deviceId: string) {
      try {

        if (!deviceId) throw Error("Device id required")

        this.paidBillApiState = ApiResponseState.LOADING;
        const queryString = new URLSearchParams({ deviceId }).toString();
        const data = await useStoreFetchRequest(`/api/bill/paid?${queryString}`, 'GET');
        console.log(data)
        this.paidBills = data as any

        this.paidBillApiState = ApiResponseState.SUCCESS;

      } catch (error: any) {

        this.paidBillApiFailure.message = error.message;
        this.paidBillApiState = ApiResponseState.FAILED;
      }
    },

    async getTotalBilling() {
      try {
        this.totalBillingApiState = ApiResponseState.LOADING;
        const data = await useStoreFetchRequest("/api/bill/all", 'GET');
        this.totalBillingApiState = ApiResponseState.SUCCESS;


      } catch (error: any) {
        console.log(error)
        this.totalBillingFailure.message = error.message;
        this.totalBillingApiState = ApiResponseState.FAILED;
      }
    },

    calculateTotalBill(option: IWaterBillAlgoOptions) {
      if (option.consumption == 0) return 0;

      const bill = useWaterBillAlgo(option)

      const total = bill.firefighting + bill.ruralWater + bill.serviceCharge + bill.waterCharge

      return Number(total.toFixed(2))
    }
  },

  getters: {
    isCreatingBill: (state) => state.billApiState === ApiResponseState.LOADING,
    failed_CreatingBill: (state) => state.billApiState === ApiResponseState.FAILED,
    success_CreatingBill: (state) => state.billApiState === ApiResponseState.SUCCESS,

    isFetchingBill: (state) => state.fetchBillApiState === ApiResponseState.LOADING,
    failed_FetchingBill: (state) => state.fetchBillApiState === ApiResponseState.FAILED,
    success_FetchingBill: (state) => state.fetchBillApiState === ApiResponseState.SUCCESS,
    hasBill: (state) => state.fetchBillApiState === ApiResponseState.SUCCESS && state.bill,

    // ACCOUNT CREDIT
    loading_AccountCredit: (state) => state.accountCreditState === ApiResponseState.LOADING,
    success_AccountCredit: (state) => state.accountCreditState === ApiResponseState.SUCCESS,
    failed_AccountCredit: (state) => state.accountCreditState === ApiResponseState.FAILED,

    // TOTAL BILLING
    isLoading_TotalBilling: (state) => state.totalBillingApiState === ApiResponseState.LOADING,
    failed_TotalBilling: (state) => state.totalBillingApiState === ApiResponseState.FAILED,
    success_TotalBilling: (state) => state.totalBillingApiState === ApiResponseState.SUCCESS,

  },


})
