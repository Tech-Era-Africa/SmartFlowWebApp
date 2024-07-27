import { useApiFetch } from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
    try {
        const queryParams = getQuery(event);
        const {token} = queryParams;

        if(!token) throw Error("Token required")

        const res= await useApiFetch('users/me', {
            method : "GET",
            headers : {
                "X-Parse-Session-Token" : token?.toString()
            }
          });

       return resolve(res.data)

    } catch (error:any) {
        console.log(error.response.data)
        return reject(error.response)
    }
}))