import { defineStore } from 'pinia'
import { useUserStore } from '~/stores/auth/user/user.store'
import { useBillStore } from '~/stores/bill/bill.store'

interface ConsumptionTrend {
  total_consumption_change: number
  date_bin: string
}

interface TotalWaterStats {
  total: number
  unit: string
  percentageChange: number
  comparisonPeriod: string
  currentPeriod: string
}

interface AverageDailyConsumptionStats {
  period:{
    startDate:string;
    endDate:string;
    days : number;
  };
  averageDailyConsumption : number;
  unit : string;
}

interface ConsumptionData {
  total: number;
  percentageChange: number;
}

interface ConsumptionInsightResponse {
  unit: string;
  comparisonPeriod: string;
  currentPeriod: string;
  consumption: ConsumptionData;
  collection: ConsumptionData;
  saved: number;
}

interface ConsumptionInsightHighestConsumptionByCluster {
  period:{
    startDate: string;
    endDate: string;
  },
  cluster: {
    clusterId: string;
    total: number;
    name:string;
  }
}


export const useConsumptionStore = defineStore('consumption', {
  state: () => ({
   startDate: null as string | null,
   endDate: null as string | null,
   collectionTarget: 15000,
  }),

  actions: {

    async getConsumptionTrend(
      options: {
        clusterId?: string,
        deviceId?: string,
        consumption_type?: 1 | 2, // 1 for usage and 2 for collection
        startDate?: string,
        endDate?: string
      } = {}): Promise<ConsumptionTrend[]> {

      try {

        const currentDate = new Date();

        // Get the current user's organization ID
        const orgId = 1

        const { data, error } = await useFetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/metrics/consumption/trend`, {
          method: 'GET',
          query: {
            orgId,
            clusterId: options.clusterId,
            consumption_type: options.consumption_type,
            startDate: options.startDate || this.startDate || new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate: options.endDate || this.endDate || new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0],
          },
          headers: {
            "Authorization": `Bearer ${useUserStore().token}`
          }
        })

        if (error.value) {
          throw new Error(error.value.data?.error || 'Failed to fetch consumption trend')
        }

        return data.value;

      } catch (error: any) {
        console.log("ERROR:", error)
        throw error
      }
    },

    async getTotalWaterConsumption(
      options: {
        clusterId?: string,
        deviceId?: string
      } = {}): Promise<TotalWaterStats> {
      try {
        const currentDate = new Date();

        // Get the current user's organization ID from the bill store which has this information
        const orgId = 1

        const { data, error } = await useFetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/metrics/consumption/total`, {
          method: 'GET',
          query: {
            orgId,
            clusterId: options.clusterId,
            startDate: this.startDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate: this.endDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
          },
          headers: {
            "Authorization": `Bearer ${useUserStore().token}`
          }
        })

        if (error.value) {
          throw new Error(error.value.data?.error || 'Failed to fetch total water consumption')
        }

        return data.value;

      } catch (error: any) {
        throw error;
      }
    },

    async getAverageDailyConsumption(
      options: {
        clusterId?: string,
        deviceId?: string
      } = {}): Promise<AverageDailyConsumptionStats> {
      try {
        const currentDate = new Date();

        // Get the current user's organization ID
        const orgId = 1

        const { data, error } = await useFetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/metrics/consumption/average/daily`, {
          method: 'GET',
          query: {
            orgId,
            clusterId: options.clusterId,
            startDate: this.startDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate: this.endDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
          },
          headers: {
            "Authorization": `Bearer ${useUserStore().token}`
          }
        })

        if (error.value) {
          throw new Error(error.value.data?.error || 'Failed to fetch average daily consumption')
        }

        return data.value;

      } catch (error: any) {
        throw error;
      }
    },

    async getInsights(
      options: {
        clusterId?: string,
        deviceId?: string
      } = {}): Promise<ConsumptionInsightResponse> {

      try {
        const currentDate = new Date();

        // Get the current user's organization ID
        const orgId = 1;

        const { data, error } = await useFetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/metrics/consumption/insight`, {
          method: 'GET',
          query: {
            orgId,
            startDate: this.startDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate: this.endDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
          },
          headers: {
            "Authorization": `Bearer ${useUserStore().token}`
          }
        })

        if (error.value) {
          throw new Error(error.value.data?.error || 'Failed to fetch total water consumption')
        }

        return data.value;

      } catch (error: any) {
        throw error;
      }
    },

    async getHighestConsumptionCluster(
      options: {
        clusterId?: string,
        deviceId?: string
      } = {}): Promise<ConsumptionInsightHighestConsumptionByCluster> {

      try {
        const currentDate = new Date();

        // Get the current user's organization ID from the bill store which has this information
        const orgId = 1;

        const { data, error } = await useFetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/metrics/consumption/cluster/highest`, {
          method: 'GET',
          query: {
            orgId,
            startDate: this.startDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate: this.endDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
          },
          headers: {
            "Authorization": `Bearer ${useUserStore().token}`
          }
        })

        if (error.value) {
          throw new Error(error.value.data?.error || 'Failed to fetch total water consumption')
        }

        return data.value;

      } catch (error: any) {
        throw error;
      }
    },

    async getLowestConsumptionCluster(
      options: {
        clusterId?: string,
        deviceId?: string
      } = {}): Promise<ConsumptionInsightHighestConsumptionByCluster> {

      try {
        const currentDate = new Date();

        // Get the current user's organization ID from the bill store which has this information
        const orgId = 1;

        const { data, error } = await useFetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/metrics/consumption/cluster/lowest`, {
          method: 'GET',
          query: {
            orgId,
            startDate: this.startDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate: this.endDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
          },
          headers: {
            "Authorization": `Bearer ${useUserStore().token}`
          }
        })

        if (error.value) {
          throw new Error(error.value.data?.error || 'Failed to fetch total water consumption')
        }

        return data.value;

      } catch (error: any) {
        throw error;
      }
    },

    async getLowestCollectionCluster(
      options: {
        clusterId?: string,
        deviceId?: string
      } = {}): Promise<ConsumptionInsightHighestConsumptionByCluster> {

      try {
        const currentDate = new Date();

        // Get the current user's organization ID from the bill store which has this information
        const orgId = 1;

        const { data, error } = await useFetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/metrics/consumption/cluster/lowest/collection`, {
          method: 'GET',
          query: {
            orgId,
            startDate: this.startDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate: this.endDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
          },
          headers: {
            "Authorization": `Bearer ${useUserStore().token}`
          }
        })

        if (error.value) {
          throw new Error(error.value.data?.error || 'Failed to fetch total water consumption')
        }

        return data.value;

      } catch (error: any) {
        throw error;
      }
    },

    async getHighestCollectionCluster(
      options: {
        clusterId?: string,
        deviceId?: string
      } = {}): Promise<ConsumptionInsightHighestConsumptionByCluster> {

      try {
        const currentDate = new Date();

        // Get the current user's organization ID from the bill store which has this information
        const orgId = 1;

        const { data, error } = await useFetch<any>(`${useRuntimeConfig().public.API_BASE_URL}/metrics/consumption/cluster/highest/collection`, {
          method: 'GET',
          query: {
            orgId,
            startDate: this.startDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate: this.endDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
          },
          headers: {
            "Authorization": `Bearer ${useUserStore().token}`
          }
        })

        if (error.value) {
          throw new Error(error.value.data?.error || 'Failed to fetch total water consumption')
        }

        return data.value;

      } catch (error: any) {
        throw error;
      }
    },

    updatePeriod(startDate: string, endDate: string) {
      this.startDate = startDate;
      this.endDate = endDate;
    }


  },




})