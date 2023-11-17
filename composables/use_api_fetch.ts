import axios, { type AxiosRequestConfig } from "axios";


export const useApiFetch = async <T>(path:string, options?:AxiosRequestConfig<T>, isAuth:boolean = false)=>{
const runtimeConfig = useRuntimeConfig()

    const header = {
        "X-Parse-Application-Id": `${runtimeConfig.B4A_APP_ID}`,
        "X-Parse-REST-API-Key": `${runtimeConfig.B4A_API_KEY}`,
        "Content-Type": "application/json",
    }

    const B4AHeader_Auth = { ...header, "X-Parse-Revocable-Session": "1" }

    return axios(`${runtimeConfig.public.API_BASE_URL}/${path}`, {
        ...options,
        headers: isAuth ? B4AHeader_Auth : header
      })
}