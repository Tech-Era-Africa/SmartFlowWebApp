import {useApiFetch} from "~/composables/use_api_fetch";
import { IDevice } from "./model/device.model";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {

       const {device, ownerId} = await readBody(event)
        
    try {
        console.log({
            ownerId, ...device
        })
        const res= await useApiFetch('functions/addNewDevice', {
            method : "POST",
            data:{
                ownerId, ...device
            }
          });

       return resolve(res.data)

    } catch (error:any) {
        console.log(error.response.data)
        return reject(error)
    }
}))