import {useApiFetch} from "~/composables/use_api_fetch";


export default defineEventHandler(async(event) => {
    const params = getRouterParams(event);
        const {id} = params;
    try {
        // Check for the availability of a bill id
        if(!id) throw Error("Bill id required")

        const res= await useApiFetch('functions/fetchBill', {
            method : "POST",
            data:{
                billId: id
            }
          });

       return res.data.result

    } catch (error:any) {
        const responseData = (error as any)?.response?.data ?? null;
        const errorMessage = (error as any)?.message ?? "Unknown error occurred";

        return { success: false, error: responseData, message: errorMessage };
    }
})