import { defineStore } from 'pinia';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';

interface InvitationResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    organizationId: string;
    organizationName: string;
    roleId: string;
  };
}

export const useOrganizationStore = defineStore({
  id: 'organizationStore',
  state: () => ({
    // Accept invitation
    acceptInvitationState: ApiResponseState.NULL,
    acceptInvitationFailure: { message: "" },
    invitationData: null as InvitationResponse['data'] | null,
  }),
  actions: {
    async acceptInvitation(token: string) {
      try {
        this.acceptInvitationState = ApiResponseState.LOADING;
        this.invitationData = null;
        this.acceptInvitationFailure = { message: "" };

        const url = `${useRuntimeConfig().public.API_BASE_URL}/organizations/invite/accept`;

        // Add a small delay to show loading state (can be removed in production)
        if (process.client) {
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        const response = await $fetch<InvitationResponse>(url, {
          method: 'POST',
          body: {
            token
          }
        }).catch((error) => {
          // Handle network or server errors
          console.error('Invitation API error:', error);

          // Create a user-friendly error response
          return {
            success: false,
            message: 'We couldn\'t connect to the server. Please check your internet connection and try again.',
            data: null
          } as InvitationResponse;
        });

        if (response.success) {
          this.invitationData = response.data;
          this.acceptInvitationState = ApiResponseState.SUCCESS;
          return response;
        } else {
          // Set a user-friendly error message
          const errorMessage = this.getUserFriendlyErrorMessage(response.message);
          throw new Error(errorMessage);
        }
      } catch (error: any) {
        this.acceptInvitationFailure.message = error.message || 'An error occurred while accepting the invitation';
        this.acceptInvitationState = ApiResponseState.FAILED;
        throw error;
      }
    },

    // Helper method to convert technical error messages to user-friendly ones
    getUserFriendlyErrorMessage(errorMessage: string): string {
      // Map of technical error messages to user-friendly ones
      const errorMap: Record<string, string> = {
        'Token is required': 'The invitation link is missing important information.',
        'Invalid token': 'This invitation link is no longer valid.',
        'Token has expired': 'This invitation has expired.',
        'Invitation already accepted': 'This invitation has already been used.',
        'Organization not found': 'The organization no longer exists.',
        'User already exists': 'You already have an account. Please log in instead.',
        '400 Bad Request': 'There was a problem with your invitation link.',
        '404 Not Found': 'We couldn\'t find your invitation.',
        '500 Internal Server Error': 'We\'re experiencing technical difficulties. Please try again later.'
      };

      // Return the mapped user-friendly message or a default one
      return errorMap[errorMessage] || 'We couldn\'t process your invitation at this time.';
    },

    resetInvitationState() {
      this.acceptInvitationState = ApiResponseState.NULL;
      this.acceptInvitationFailure = { message: "" };
      this.invitationData = null;
    }
  }
});
