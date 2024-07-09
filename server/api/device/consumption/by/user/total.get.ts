import {useApiFetch} from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
    const queryParams = getQuery(event);
        const {userId} = queryParams;

        
    try {
        // Check for the availability of a user id
        if(!userId) throw Error("User id required")

        const res= await useApiFetch('functions/getTotalDeviceConsumptionByUser', {
            method : "POST",
            data:{
                userId
            }
          });

       return resolve(res.data.result)

    } catch (error:any) {
        console.log(error.response.data)
        return reject(error)
    }
}))