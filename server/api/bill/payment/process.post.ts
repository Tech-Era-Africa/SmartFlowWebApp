import {useApiFetch} from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {

       const {billId, paymentRef} = await readBody(event)
        
    try {
        const res= await useApiFetch('functions/processPayment', {
            method : "POST",
            data:{
                billId,
                paymentRef
            }
          });

       return resolve(res.data.result)

    } catch (error:any) {
        console.log(error.response.data)
        return reject(error)
    }
}))