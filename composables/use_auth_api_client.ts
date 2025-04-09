import { useUserStore } from '~/stores/auth/user/user.store';
import { useToast } from '~/components/ui/toast/use-toast';

// Track if we're currently refreshing the token to prevent multiple refresh attempts
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
let pendingRequests: Array<() => void> = [];

// Last activity timestamp
let lastActivityTime = Date.now();
// Inactivity timeout in milliseconds (30 minutes)
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;
// Session check interval in milliseconds (1 minute)
const SESSION_CHECK_INTERVAL = 60 * 1000;

// Function to update the last activity timestamp
export const updateLastActivity = () => {
  lastActivityTime = Date.now();
};

// Initialize activity tracking
if (process.client) {
  // Update activity on user interactions
  ['click', 'keypress', 'scroll', 'mousemove', 'touchstart'].forEach(event => {
    window.addEventListener(event, updateLastActivity);
  });

  // Check session status periodically
  setInterval(() => {
    const userStore = useUserStore();
    const currentTime = Date.now();
    const inactiveTime = currentTime - lastActivityTime;

    // If user is inactive for too long and is logged in, show session expiry dialog
    if (inactiveTime > INACTIVITY_TIMEOUT && userStore.token) {
      // Set a flag in localStorage to indicate session expiry due to inactivity
      localStorage.setItem('session_expired', 'inactivity');
      // Redirect to login page
      window.location.href = '/auth/login';
    }
  }, SESSION_CHECK_INTERVAL);
}

/**
 * Authenticated API client with automatic token refresh
 */
export const useAuthApiClient = () => {
  const userStore = useUserStore();
  const toast = useToast();
  const router = useRouter();

  /**
   * Execute a request with authentication and token refresh
   */
  const executeRequest = async <T>(
    url: string,
    options: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: any;
      query?: Record<string, string>;
      headers?: Record<string, string>;
    }
  ): Promise<T> => {
    // Update activity timestamp on each API call
    updateLastActivity();

    // If no token is available, redirect to login
    if (!userStore.token) {
      router.push('/auth/login');
      throw new Error('Authentication required');
    }

    // Prepare headers with authentication token
    const headers = {
      'Authorization': `Bearer ${userStore.token}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      // Execute the request
      const { data, error } = await useFetch<T>(url, {
        method: options.method,
        body: options.body,
        query: options.query,
        headers
      });

      if (error.value) {
        // Handle 401 Unauthorized errors
        if (error.value.statusCode === 401) {
          // If we're already refreshing, queue this request
          if (isRefreshing) {
            return new Promise((resolve) => {
              pendingRequests.push(() => {
                executeRequest<T>(url, options).then(resolve);
              });
            }) as Promise<T>;
          }

          // Start refreshing
          isRefreshing = true;

          try {
            // Attempt to refresh the token
            const refreshed = await userStore.refreshAccessToken();
            
            // If refresh successful, retry all pending requests
            if (refreshed) {
              isRefreshing = false;
              pendingRequests.forEach(callback => callback());
              pendingRequests = [];
              
              // Retry the current request with the new token
              return executeRequest<T>(url, options);
            } else {
              // If refresh failed, clear tokens and redirect to login
              isRefreshing = false;
              pendingRequests = [];
              userStore.clearUserToken();
              
              // Set a flag in localStorage to indicate session expiry
              localStorage.setItem('session_expired', 'expired');
              
              // Redirect to login page
              router.push('/auth/login');
              throw new Error('Session expired. Please log in again.');
            }
          } catch (refreshError) {
            // Handle refresh token errors
            isRefreshing = false;
            pendingRequests = [];
            userStore.clearUserToken();
            
            // Set a flag in localStorage to indicate session expiry
            localStorage.setItem('session_expired', 'expired');
            
            // Redirect to login page
            router.push('/auth/login');
            throw new Error('Session expired. Please log in again.');
          }
        }

        // Handle other errors
        throw new Error(error.value.data?.message || 'An error occurred');
      }

      return data.value as T;
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error('API request failed:', error);
      throw error;
    }
  };

  return {
    get: <T>(url: string, query?: Record<string, string>, headers?: Record<string, string>) => 
      executeRequest<T>(url, { method: 'GET', query, headers }),
    
    post: <T>(url: string, body?: any, headers?: Record<string, string>) => 
      executeRequest<T>(url, { method: 'POST', body, headers }),
    
    put: <T>(url: string, body?: any, headers?: Record<string, string>) => 
      executeRequest<T>(url, { method: 'PUT', body, headers }),
    
    delete: <T>(url: string, body?: any, headers?: Record<string, string>) => 
      executeRequest<T>(url, { method: 'DELETE', body, headers })
  };
};
