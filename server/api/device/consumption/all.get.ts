


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
    const queryParams = getQuery(event);
        const {id, startDate, endDate} = queryParams;

        console.log("Gettting")
        
    try {
        // Check for the availability of a user id
        if(!id) throw Error("Org id required")
        if(!startDate) throw Error("Start date required")
        if(!endDate) throw Error("End date required")

        const baseUrl = useRuntimeConfig().INFLUX_SERVER_BASE_URL
        const res= await $fetch(`${baseUrl}/consumption/trend/change/by/org`,{
            method : "GET",
            query:{
                orgId : id,
                startDate,
                endDate
            }
          })

       return resolve(res)

    } catch (error:any) {
        console.log(error)
        return reject(error)
    }
}))
