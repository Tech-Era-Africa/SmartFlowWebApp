import {useApiFetch} from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
    const queryParams = getQuery(event);
        const {groupId} = queryParams;

        
    try {
        // Check for the availability of a user id
        if(!groupId) throw Error("Group id required")

        const res= await useApiFetch('functions/getUserDevicesInGroup', {
            method : "POST",
            data:{
                groupId,
            }
          });

       return resolve(res.data.result ?? [])

    } catch (error:any) {
        return reject(error)
    }
}))