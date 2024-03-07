import {useApiFetch} from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
        
    try {
        const {name, createdBy, orgId} = await readBody(event)
        if(!name) throw Error("Name required")
        if(!createdBy) throw Error("Created by required")
        if(!orgId) throw Error("Org id required")

        const res= await useApiFetch('functions/createDeviceGroup', {
            method : "POST",
            data:{
               name,
               createdBy,
               orgId
            }
          });

       return resolve(res.data.result)

    } catch (error:any) {
        console.log(error.response.data)
        return reject(error)
    }
}))