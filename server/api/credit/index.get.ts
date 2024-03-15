
export default defineEventHandler((event) => new Promise(async (resolve, reject) => {

    try {

        //Function to get all bill total
       await new Promise(resolve => {
            setTimeout(() => {
                resolve(0); // Resolve the promise after 5600 milliseconds
            }, 5600);
        })

       return resolve(12)

    } catch (error:any) {
        return reject(error.response.data)
    }
}))