import { LoginDTO } from "~/stores/auth/dto/login.dto";
import {useApiFetch} from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
    try {
        const cred: LoginDTO = await readBody(event)
        const res= await useApiFetch('login', {
            method : "GET",
            params: {
              username : cred.email,
              password : cred.password
            }
          });

       return resolve(res.data)

    } catch (error:any) {
        console.log(error.response.data)
        return reject(error.response)
    }
}))