import {useApiFetch} from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
 
        
    try {
        const body =  await readBody(event)
        const {eui, consumption} = body;

        // Check for the availability of device eui
        if(!eui) throw Error("Device EUI is required")

        const res= await useApiFetch('functions/updateDeviceConsumptionByEUI', {
            method : "POST",
            data:{
                eui,
                newConsumption : consumption
            }
          });

       return resolve(res.data)

    } catch (error:any) {
        console.log(error.response.data)
        return reject(error)
    }
}))