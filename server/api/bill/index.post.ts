import {useApiFetch} from "~/composables/use_api_fetch";
import { type IBillOption } from "../../../stores/bill/model/bill.model";


export default defineEventHandler(async (event) => {

       const billOption: IBillOption = await readBody(event)
        
    try {

        const res= await useApiFetch('functions/generateBillWithDeviceConsumptions', {
            method : "POST",
            data:{
                ...billOption.bill, deviceIds : billOption.deviceIds
            }
          });

       return res.data.result;

    } catch (error:any) {
        const responseData = (error as any)?.response?.data ?? null;
        const errorMessage = (error as any)?.message ?? "Unknown error occurred";

        return { success: false, error: responseData, message: errorMessage };
    }
})