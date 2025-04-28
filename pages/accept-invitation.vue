<template>
  <div class="h-screen bg-gray-50 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-12 w-auto" src="/logo.png" alt="SmartFlow" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Join Organization
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        You've been invited to join an organization on SmartFlow
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-6">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p class="text-gray-600 text-center">Verifying your invitation...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="invitationError" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">Oops! Something went wrong</h3>
          <div class="mt-3">
            <p class="text-sm text-gray-500">
              We couldn't process your invitation. This might be because:
            </p>
            <ul class="mt-2 text-sm text-gray-500 list-disc list-inside">
              <li>The invitation link has expired</li>
              <li>The invitation has already been used</li>
              <li>The invitation was canceled by the organization admin</li>
            </ul>
          </div>
          <div class="mt-6 flex justify-center space-x-4">
            <button @click="retryInvitation" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Try Again
            </button>
            <button @click="goToLogin" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Go to Login
            </button>
          </div>
          <div class="mt-4 text-xs text-gray-400">
            <p>If you continue to experience issues, please contact your organization administrator.</p>
          </div>
        </div>

        <!-- Success State -->
        <div v-else-if="invitationAccepted" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">Invitation Accepted!</h3>
          <div class="mt-3">
            <p class="text-sm text-gray-500">
              You've been successfully invited to join <span class="font-semibold">{{ invitationData?.organizationName }}</span>
            </p>
          </div>
          <div class="mt-6 bg-gray-50 p-4 rounded-md">
            <div class="flex items-center mb-2">
              <div class="w-1/3 text-sm font-medium text-gray-500 text-left">Email:</div>
              <div class="w-2/3 text-sm text-gray-900">{{ invitationData?.email }}</div>
            </div>
            <div class="flex items-center">
              <div class="w-1/3 text-sm font-medium text-gray-500 text-left">Organization:</div>
              <div class="w-2/3 text-sm text-gray-900">{{ invitationData?.organizationName }}</div>
            </div>
          </div>
          <div class="mt-6">
            <button @click="proceedToSignup" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Complete Registration
            </button>
          </div>
        </div>

        <!-- Initial State (No token) -->
        <div v-else-if="!token" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 mb-4">
            <svg class="h-6 w-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">Missing Invitation Link</h3>
          <div class="mt-3">
            <p class="text-sm text-gray-500">
              We couldn't find an invitation token in your link. Please make sure you clicked the complete invitation link from your email.
            </p>
          </div>
          <div class="mt-6">
            <img src="/images/email-illustration.svg" alt="Check your email" class="h-32 mx-auto mb-4 opacity-75" onerror="this.style.display='none'" />
            <p class="text-sm text-gray-500">
              Check your email inbox for an invitation from SmartFlow and click the complete link.
            </p>
          </div>
          <div class="mt-6">
            <button @click="goToLogin" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrganizationStore } from '~/stores/organization/organization.store';

const route = useRoute();
const router = useRouter();
const organizationStore = useOrganizationStore();

const isLoading = ref(false);
const invitationError = ref('');
const token = ref('');

// Computed properties for cleaner template
const invitationAccepted = computed(() => organizationStore.acceptInvitationState === 'SUCCESS');
const invitationData = computed(() => organizationStore.invitationData);

// Process the invitation token
const processInvitation = async () => {
  if (!token.value) return;

  try {
    isLoading.value = true;
    invitationError.value = '';

    await organizationStore.acceptInvitation(token.value);

  } catch (error: any) {
    // Set a generic user-friendly error message instead of showing technical details
    invitationError.value = 'We couldn\'t verify your invitation at this time.';

    // Log the actual error for debugging purposes
    console.error('Invitation error:', error);
  } finally {
    isLoading.value = false;
  }
};

// Retry the invitation process
const retryInvitation = () => {
  invitationError.value = '';
  processInvitation();
};

// Navigate to login page
const goToLogin = () => {
  router.push('/auth/login');
};

// Proceed to signup with pre-filled data
const proceedToSignup = () => {
  if (invitationData.value) {
    router.push({
      path: '/auth/signup',
      query: {
        email: invitationData.value.email,
        organizationId: invitationData.value.organizationId,
        organizationName: invitationData.value.organizationName,
        roleId: invitationData.value.roleId,
        fromInvitation: 'true'
      }
    });
  }
};

// On component mount, check for token in URL
onMounted(() => {
  // Reset any previous invitation state
  organizationStore.resetInvitationState();

  // Get token from query parameter
  const queryToken = route.query.token as string;

  if (queryToken) {
    token.value = queryToken;
    processInvitation();
  }
});
</script>