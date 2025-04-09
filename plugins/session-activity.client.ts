import { updateLastActivity } from '~/composables/use_auth_api_client';

export default defineNuxtPlugin(() => {
  // Initialize activity tracking
  updateLastActivity();
  
  // Set up event listeners for user activity
  ['click', 'keypress', 'scroll', 'mousemove', 'touchstart'].forEach(event => {
    window.addEventListener(event, updateLastActivity);
  });
  
  // Check for session expiry on page load
  const sessionExpired = localStorage.getItem('session_expired');
  if (sessionExpired) {
    // We'll handle this in the login page, so we don't need to do anything here
    console.log('Session expired flag detected:', sessionExpired);
  }
});
