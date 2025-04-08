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
    async getConsumptionTrend(startDate: string,
      endDate: string,
      orgId: string,
      options: {
          clusterId?: string,
          deviceId?: string
      } = {}): Promise<{total_consumption_change: number, date_bin: string}[]> {

      try {

        const currentDate = new Date();

        const { data, error } = await useFetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/metrics/consumption/trend`, {
          method: 'GET',
          query: {
            orgId: "hXR7sQI3FI",
            startDate  : startDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate : endDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
          },
          headers: {
            "Authorization": `Bearer ${useUserStore().token}`
          }
        })

        if (error.value) {
          throw new Error(error.value.data?.error || 'Failed to fetch consumption trend')
        }

        console.log("DATA:", data.value)
        console.log("ERROR:", error.value)

        // const groupedData = Object.entries(data.value).map(([key, value]) => ({
        //   name: key,
        //   data: (value as any[]).map(entry => ({
        //     x: entry.date_bin,
        //     y: entry.total_consumption_change,
        //   }))
        // }));

        return data.value;

      } catch (error: any) {
        console.log("ERROR:", error)
        throw error
      }
    },

    async getTotalWaterConsumption(startDate: string,
      endDate: string,
      orgId: string,
      options: {
          clusterId?: string,
          deviceId?: string
      } = {}) {
      try {

        const { data, error } = await useFetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/metrics/consumption/total`, {
          method: 'GET',
          query: {
            orgId : "hXR7sQI3FI",
            startDate,
            endDate
          },
          headers: {
            "Authorization": `Bearer ${useUserStore().token}`
          }
        })

        if (error.value) {
          throw new Error(error.value.data?.error || 'Failed to fetch total water consumption')
        }

        return data;
       
      } catch (error: any) {
        throw error;
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