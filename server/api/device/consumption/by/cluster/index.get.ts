


export default defineEventHandler(async(event) =>  {
    const queryParams = getQuery(event);
        const {clusterId, startDate, endDate} = queryParams;

        
    try {
        // Check for the availability of a user id
        if(!clusterId) throw Error("Cluster id required")
        if(!startDate) throw Error("Start date required")
        if(!endDate) throw Error("End date required")

        const res= await $fetch('http://localhost:4700/consumption/trend/change/by/org',{
            method : "GET",
            query:{
                orgId : "ASH2025", //TODO!: MAKE DYNAMIC
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
