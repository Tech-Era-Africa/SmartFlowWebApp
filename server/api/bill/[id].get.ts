import {useApiFetch} from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
    const params = getRouterParams(event);
        const {id} = params;
    try {
        // Check for the availability of a bill id
        if(!id) throw Error("Bill id required")

        const res= await useApiFetch('functions/fetchBillWithDevices', {
            method : "POST",
            data:{
                billId: id
            }
          });

       return resolve(res.data.result)

    } catch (error:any) {
        return reject(error.response.data)
    }
}))