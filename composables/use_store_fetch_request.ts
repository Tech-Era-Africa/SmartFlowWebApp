export const useStoreFetchRequest = async (endpoint:string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?:any) => {
    try {
      const { data, error } = await useFetch(endpoint, {
        method,
        body,
      });
  
      if (error.value) {
        throw new Error(error.value.data.data.error); // This way because of B4A
      }
  
      return data.value;
    } catch (error:any) {
      console.log("SOME ERROR:" ,error)
      throw new Error('Server error! ' + error.message);
    }
  }

  