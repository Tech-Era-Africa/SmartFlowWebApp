import {useApiFetch} from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
    try {

        const queryParams = getQuery(event);
        const {roleId} = queryParams;

        if(!roleId) return reject(Error("Role id required").message) 

        const res = await useApiFetch('functions/getRolePermissionsOrderedByTag', {
            method: "POST",
            data:{
                roleId
            }
        });


        return resolve(res.data.result);
    } catch (error: any) {
        console.log(error.response.data);
        return reject(error.response);
    }
}));
