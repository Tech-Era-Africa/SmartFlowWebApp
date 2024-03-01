import {useApiFetch} from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
    try {

        const body:{roleId:string, permissions?:string[], op:'add' | 'remove'} = await readBody(event)

        const {roleId, permissions, op} = body;

        if(!roleId) return reject(Error("Role id required").message) 

        if(!op) return reject(Error("add or remove operation required").message)

        const res = await useApiFetch('functions/manageRolePermissions', {
            method: "POST",
            data:{
                roleId,
                permissionsToRemove :  op == 'remove' ? permissions : undefined,
                permissionsToAdd : op == 'add' ?  permissions : undefined
            }
        });


        return resolve(res.data.result);
    } catch (error: any) {
        console.log(error.response.data);
        return reject(error.response);
    }
}));
