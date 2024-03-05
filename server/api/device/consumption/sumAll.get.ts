


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
    const queryParams = getQuery(event);
        const {uid, startDate, endDate} = queryParams;

        
    try {
        // Check for the availability of a user id
        if(!uid) throw Error("User id required")
        if(!startDate) throw Error("Start date required")
        if(!endDate) throw Error("End date required")

        const res= await $fetch('http://localhost:4700/consumption/sum/all/by/uid',{
            method : "GET",
            query:{
                uid,
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
