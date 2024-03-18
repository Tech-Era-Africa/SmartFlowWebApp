


export default defineEventHandler(async(event) =>  {
    const queryParams = getQuery(event);
        const {id, startDate, endDate} = queryParams;

        
    try {
        // Check for the availability of a user id
        if(!id) throw Error("Cluster id required")
        if(!startDate) throw Error("Start date required")
        if(!endDate) throw Error("End date required")

        const baseUrl = useRuntimeConfig().INFLUX_SERVER_BASE_URL
        const res= await $fetch(`${baseUrl}/consumption/trend/change/by/device`,{
            method : "GET",
            query:{
                deviceId : id,
                startDate,
                endDate
            }
          })

       return res

    } catch (error:any) {
        const responseData = (error as any)?.response?.data ?? null;
        const errorMessage = (error as any)?.message ?? "Unknown error occurred";

        return { success: false, error: responseData, message: errorMessage };
    }
})
