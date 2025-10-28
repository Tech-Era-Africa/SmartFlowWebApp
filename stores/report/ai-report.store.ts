import { defineStore } from 'pinia';
import { ApiResponseState } from '~/utils/enum/apiResponse.enum';
import { useUserStore } from '../auth/user/user.store';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface ConsumerInfo {
  totalConsumers: number;
  consumerTypes: string;
}

export interface WaterConsumptionReport {
  success: boolean;
  period: {
    startDate: string; // e.g. "2025-10-01"
    endDate: string;   // e.g. "2025-10-28"
  };
  organization: {
    id: number;
    name: string;
  };
  clustersAnalyzed: number;
  format: "markdown" | string;
  content: string; // full markdown report body
}

export interface AIReportState {
  // Report generation
  reportApiState: ApiResponseState;
  reportApiFailure: { message: string };
  reportMarkdown: string;

  // Date range
  dateRange: DateRange;

  // Consumer information
  consumerInfo: ConsumerInfo;

  // UI state
  isSheetOpen: boolean;
}

export const useAIReportStore = defineStore({
  id: 'aiReportStore',
  state: (): AIReportState => ({
    reportApiState: ApiResponseState.NULL,
    reportApiFailure: { message: '' },
    reportMarkdown: '',
    dateRange: {
      startDate: null,
      endDate: null,
    },
    consumerInfo: {
      totalConsumers: 0,
      consumerTypes: 'Students',
    },
    isSheetOpen: false,
  }),

  actions: {
    /**
     * Generate AI report for the given date range and consumer information
     */
    async generateReport(startDate: Date, endDate: Date, consumerInfo?: ConsumerInfo) {

      try {
        this.reportApiState = ApiResponseState.LOADING;
        this.reportApiFailure = { message: '' };
        this.reportMarkdown = '';

        // Store consumer info if provided
        if (consumerInfo) {
          this.consumerInfo = consumerInfo;
        }

        // Format dates as ISO strings
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];

        // Build query parameters
        const queryParams = new URLSearchParams({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          orgId: '1',
          totalConsumers: this.consumerInfo.totalConsumers.toString(),
          consumerTypes: this.consumerInfo.consumerTypes,
        });

        // Make API call to generate report
        const { data, error } = await useFetch<WaterConsumptionReport>(
          `${useRuntimeConfig().public.API_BASE_URL}/ai/consumption-report?${queryParams.toString()}`,
          {
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${useUserStore().token}`
            }
          }
        );

        if (error.value) {
          throw new Error(error.value.data?.error || 'Failed to generate report')
        }

        // API returns { success, period, organization, clustersAnalyzed, format, content }
        this.reportMarkdown = data.value?.content || '';
        this.reportApiState = ApiResponseState.SUCCESS;
        this.dateRange = { startDate, endDate };

        return this.reportMarkdown;
      } catch (error: any) {
        this.reportApiFailure.message =
          error.message || 'Failed to generate report';
        this.reportApiState = ApiResponseState.FAILED;
        throw error;
      }
    },

    /**
     * Set date range
     */
    setDateRange(startDate: Date, endDate: Date) {
      this.dateRange = { startDate, endDate };
    },

    /**
     * Open/close the report sheet
     */
    toggleSheet(isOpen: boolean) {
      this.isSheetOpen = isOpen;
    },

    /**
     * Reset report state
     */
    resetReport() {
      this.reportApiState = ApiResponseState.NULL;
      this.reportApiFailure = { message: '' };
      this.reportMarkdown = '';
      this.dateRange = { startDate: null, endDate: null };
    },

    /**
     * Clear report data but keep sheet open
     */
    clearReportData() {
      this.reportMarkdown = '';
      this.reportApiState = ApiResponseState.NULL;
      this.reportApiFailure = { message: '' };
    },
  },

  getters: {
    isGeneratingReport: (state) =>
      state.reportApiState === ApiResponseState.LOADING,
    hasReport: (state) => state.reportMarkdown.length > 0,
    reportError: (state) => state.reportApiFailure.message,
    isReportSuccess: (state) =>
      state.reportApiState === ApiResponseState.SUCCESS,
  },
});

