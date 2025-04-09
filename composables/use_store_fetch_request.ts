import { useAuthApiClient } from './use_auth_api_client';
import { useUserStore } from '~/stores/auth/user/user.store';

export const useStoreFetchRequest = async (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any, headers?: any) => {
  try {
    const userStore = useUserStore();
    const isFullUrl = endpoint.startsWith('http');
    const url = isFullUrl ? endpoint : `${useRuntimeConfig().public.API_BASE_URL}${endpoint}`;

    // If this is an authenticated request (has Authorization header or uses user token)
    if (headers?.Authorization || (userStore.token && !headers?.['X-Parse-Application-Id'])) {
      // Use the auth API client for authenticated requests
      const authClient = useAuthApiClient();

      // Extract query parameters if they exist in the URL
      let queryParams: Record<string, string> = {};
      if (!isFullUrl && endpoint.includes('?')) {
        const [path, queryString] = endpoint.split('?');
        const searchParams = new URLSearchParams(queryString);
        searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });
        endpoint = path;
      }

      // Use the appropriate method from the auth client
      switch (method) {
        case 'GET':
          return await authClient.get(url, queryParams, headers);
        case 'POST':
          return await authClient.post(url, body, headers);
        case 'PUT':
          return await authClient.put(url, body, headers);
        case 'DELETE':
          return await authClient.delete(url, body, headers);
      }
    } else {
      // For non-authenticated requests, use the original implementation
      const { data, error } = await useFetch(url, {
        method,
        body,
        headers
      });

      if (error.value) {
        throw new Error(error.value.data?.data?.error || error.value.statusMessage || 'Unknown error');
      }

      return data.value;
    }
  } catch (error: any) {
    console.log("API REQUEST ERROR:", error);
    throw new Error(error.message || 'Server error!');
  }
}

