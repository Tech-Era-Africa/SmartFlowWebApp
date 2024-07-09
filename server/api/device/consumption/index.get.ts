import {useApiFetch} from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
    const queryParams = getQuery(event);
        const {deviceId, year} = queryParams;

        
    try {
        // Check for the availability of a user id
        if(!deviceId) throw Error("User id required")
        if(!year) throw Error("Year required")

        const res= await useApiFetch('functions/sumConsumptionsByMonthInYearForDevice', {
            method : "POST",
            data:{
                deviceId,
                year
            }
          });

       return resolve(res.data.result ?? [])

    } catch (error:any) {
        console.log(error.response.data)
        return reject(error)
    }
}))