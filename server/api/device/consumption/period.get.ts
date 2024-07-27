import {useApiFetch} from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
    const queryParams = getQuery(event);
        const {deviceId, period} = queryParams;

        
    try {
        // Check for the availability of a user id
        if(!deviceId) throw Error("User id required")

        const res= await useApiFetch('functions/getTotalConsumptionInPeriod', {
            method : "POST",
            data:{
                deviceId,
                period
            }
          });

       return resolve(res.data.result)

    } catch (error:any) {
        console.log(error.response.data)
        return reject(error)
    }
}))