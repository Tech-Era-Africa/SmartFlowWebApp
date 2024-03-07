import {useApiFetch} from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {

       
    // eui, deviceId, ownerId, orgId, deviceGroupId
    try {
        const {device, ownerId, orgId, clusterId} = await readBody(event)

        if(!device) throw Error("Device required")
        if(!ownerId) throw Error("Owner id required")
        if(!orgId) throw Error("Org id required")
        if(!clusterId) throw Error("Cluster id required")

        const res= await useApiFetch('functions/addNewDevice', {
            method : "POST",
            data:{
                orgId,
                deviceGroupId: clusterId,
                ownerId, ...device
            }
          });

       return resolve(res.data)

    } catch (error:any) {
        console.log(error.response.data)
        return reject(error)
    }
}))