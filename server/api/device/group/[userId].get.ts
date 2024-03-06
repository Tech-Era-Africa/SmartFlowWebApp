import {useApiFetch} from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
    const userId = getRouterParam(event, 'userId')

        
    try {
        // Check for the availability of a USER id
        if(!userId) throw Error("User id required")

        const res= await useApiFetch('functions/getUserDeviceGroupWithCount', {
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