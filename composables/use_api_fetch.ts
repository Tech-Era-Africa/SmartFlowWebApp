import axios, { type AxiosRequestConfig } from "axios";
import type { UseFetchOptions } from "nuxt/app";


export const useApiFetch = async <T>(path:string, options?:AxiosRequestConfig<T>, isAuth:boolean = false)=>{
const runtimeConfig = useRuntimeConfig()

    const header = {
        "X-Parse-Application-Id": `${runtimeConfig.B4A_APP_ID}`,
        "X-Parse-REST-API-Key": `${runtimeConfig.B4A_API_KEY}`,
        "X-Parse-Master-Key": `${runtimeConfig.B4A_MASTER_KEY}`,
        "Content-Type": "application/json",
    }

    const B4AHeader_Auth = { ...header, "X-Parse-Revocable-Session": "1" }

    return axios(`${runtimeConfig.public.API_BASE_URL}/${path}`, {
        ...options,
        headers: isAuth ? B4AHeader_Auth : header
      })
}