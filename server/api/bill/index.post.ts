import {useApiFetch} from "~/composables/use_api_fetch";
import { IBillOption } from "../../../stores/bill/model/bill.model";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {

       const billOption: IBillOption = await readBody(event)
        
    try {
        const res= await useApiFetch('functions/generateBillWithDeviceConsumptions', {
            method : "POST",
            data:{
                ...billOption.bill, deviceIds : billOption.devices.map(device=> device.objectId)
            }
          });

       return resolve(res.data.result)

    } catch (error:any) {
        console.log(error.response.data)
        return reject(error)
    }
}))