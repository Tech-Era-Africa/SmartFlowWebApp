import {useApiFetch} from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
    const queryParams = getQuery(event);
        const {deviceId} = queryParams;

        
    try {
        // Check for the availability of a device id
        if(!deviceId) throw Error("Device id required")

        const res= await useApiFetch('functions/getLatestDeviceConsumption', {
            method : "POST",
            data:{
                deviceId
            }
          });

       return resolve(res.data.result)

    } catch (error:any) {
        console.log(error.response.data)
        return reject(error)
    }
}))