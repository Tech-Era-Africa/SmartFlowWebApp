import { ApiResponseState } from "~/utils/enum/apiResponse.enum";

export const useHandleStoreRequest = async (url:string, method:any, state:ApiResponseState, failure:any, dataHandler:Function) => {
  try {
    state = ApiResponseState.LOADING;

    const { data, error } = await useFetch(url, {
      method,
    });

    if (error.value) {
      state = ApiResponseState.FAILED;
      failure.message = error.value.data.data.error; // Handle error
    } else {
      state = ApiResponseState.SUCCESS;
      if (dataHandler) {
        dataHandler(data.value);
      }
    }
  } catch (error) {
    state = ApiResponseState.FAILED;
    failure.message = 'Server error! Could not load data.';
    console.error(error);
  }
}
