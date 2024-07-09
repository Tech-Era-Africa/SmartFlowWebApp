import {useApiFetch} from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
    try {

        const res = await useApiFetch('functions/getPermissionsOrderedByTag', {
            method: "POST",
        });


        return resolve(res.data.result);
    } catch (error: any) {
        console.log(error.response.data);
        return reject(error.response);
    }
}));
