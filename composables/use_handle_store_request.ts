import { ApiResponseState } from "~/utils/enum/apiResponse.enum";
import { useAuthApiClient } from './use_auth_api_client';
import { useUserStore } from '~/stores/auth/user/user.store';

export const useHandleStoreRequest = async (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', state: ApiResponseState, failure: any, dataHandler: Function) => {
  try {
    state = ApiResponseState.LOADING;
    const userStore = useUserStore();
    const isFullUrl = url.startsWith('http');
    const fullUrl = isFullUrl ? url : `${useRuntimeConfig().public.API_BASE_URL}${url}`;

    // Extract query parameters if they exist in the URL
    let queryParams: Record<string, string> = {};
    let path = url;

    if (!isFullUrl && url.includes('?')) {
      const [urlPath, queryString] = url.split('?');
      path = urlPath;
      const searchParams = new URLSearchParams(queryString);
      searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
    }

    // If user is authenticated, use the auth API client
    if (userStore.token) {
      try {
        const authClient = useAuthApiClient();
        let result;

        switch (method) {
          case 'GET':
            result = await authClient.get(fullUrl, queryParams);
            break;
          case 'POST':
            result = await authClient.post(fullUrl);
            break;
          case 'PUT':
            result = await authClient.put(fullUrl);
            break;
          case 'DELETE':
            result = await authClient.delete(fullUrl);
            break;
        }

        state = ApiResponseState.SUCCESS;
        if (dataHandler) {
          dataHandler(result);
        }
      } catch (authError: any) {
        state = ApiResponseState.FAILED;
        failure.message = authError.message || 'Authentication error';
      }
    } else {
      // For non-authenticated requests, use the original implementation
      const { data, error } = await useFetch(fullUrl, {
        method,
      });

      if (error.value) {
        state = ApiResponseState.FAILED;
        failure.message = error.value.data?.data?.error || error.value.statusMessage || 'Unknown error';
      } else {
        state = ApiResponseState.SUCCESS;
        if (dataHandler) {
          dataHandler(data.value);
        }
      }
    }
  } catch (error: any) {
    state = ApiResponseState.FAILED;
    failure.message = error.message || 'Server error! Could not load data.';
    console.error('API request error:', error);
  }
}
