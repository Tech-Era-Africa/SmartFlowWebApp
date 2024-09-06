import { defineStore } from 'pinia'
import { useUserStore } from '~/stores/auth/user/user.store'
import { ApiResponseState } from '~/utils/enum/apiResponse.enum'

interface ConsumptionStats {
  waterUsed: string
  waterUsedChange: string
  estimatedBill: string
  estimatedBillChange: string
  peakUsageDate: string
  peakUsageGroup: string
  peakUsageAmount: string
  waterUsedChangeDescription:string
  peakUsageDescription:string
  peakUsageClusterDescription:string
  averageConsumption : number
}

export const useConsumptionStore = defineStore('consumption', {
  state: () => ({
    stats: {
      waterUsed: '0',
      waterUsedChange: '0',
      estimatedBill: '0',
      estimatedBillChange: '0',
      peakUsageDate: '',
      peakUsageGroup: '',
      peakUsageAmount: '0',
      waterUsedChangeDescription : '',
      averageConsumption : 0
    } as ConsumptionStats,
    trendPeriod: 'year',
    consumptionInsightsApiState: ApiResponseState.NULL,
    consumptionInsightsApiFailure: { message: "" },
  }),

  actions: {
    async getConsumptionInsightsByOrg(startDate: string, endDate: string) {
      try {
        this.consumptionInsightsApiState = ApiResponseState.LOADING

        const { data, error } = await useFetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/influx/consumption/insights/by/org`, {
          method: 'GET',
          query: {
            id: useUserStore().selectedOrganisation.objectId,
            startDate,
            endDate
          },
          headers: {
            "Authorization": `Bearer ${useUserStore().token}`
          }
        })

        if (error.value) {
          throw new Error(error.value.data?.error || 'Failed to fetch consumption insights')
        }

        this.consumptionInsightsApiState = ApiResponseState.SUCCESS
        this.stats = {
          // Water consumption
          waterUsed: data.value.totalConsumption.totalConsumption.toFixed(2),
          waterUsedChange: data.value.totalConsumption.consumptionChange.toFixed(2),
          waterUsedChangeDescription: data.value.totalConsumption.description,

          // Estimated bill (placeholder values)
          estimatedBill: '0', // Not provided in the API response
          estimatedBillChange: '0', // Not provided in the API response

          // Peak usage information
          peakUsageDate: new Date(data.value.peakUsage.peakTime).toLocaleDateString(),
          peakUsageAmount: data.value.peakUsage.peakUsage.toFixed(2),
          peakUsageDescription: data.value.peakUsage.description,

          // Peak usage cluster information
          peakUsageGroup: data.value.peakUsageCluster.peakUsageCluster,
          peakUsageClusterDescription: data.value.peakUsageCluster.description,

          // Average consumption
          averageConsumption : data.value.averageConsumption
        }
      } catch (error: any) {
        this.consumptionInsightsApiState = ApiResponseState.FAILED
        this.consumptionInsightsApiFailure.message = error.message
      }
    },

    setTrendPeriod(period: string) {
      this.trendPeriod = period
    }
  },

  getters: {
    isLoadingConsumptionInsights: (state) => state.consumptionInsightsApiState === ApiResponseState.LOADING,
    failedConsumptionInsights: (state) => state.consumptionInsightsApiState === ApiResponseState.FAILED,
    successConsumptionInsights: (state) => state.consumptionInsightsApiState === ApiResponseState.SUCCESS,
  }
})