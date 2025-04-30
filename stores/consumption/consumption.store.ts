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
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
  averageDailyConsumption: number;
  unit: string;
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
  period: {
    startDate: string;
    endDate: string;
  },
  cluster: {
    clusterId: string;
    total: number;
    name: string;
  }
}


export const useConsumptionStore = defineStore('consumption', {
  state: () => ({
    collectionTarget: 15000,
    totalWaterConsumption: {} as TotalWaterStats,
    trendPeriod: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
      period: 'month'
    },
    clusterPeriod: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
      period: 'month'
    },
    clusterComparePeriod: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
      period: 'month'
    },
    consumptionStatsPeriod: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
      period: 'month'
    },
    insightsPeriod: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
      period: 'month'
    },
    dailyPeriod: {
      startDate: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)).toISOString().split('T')[0],
      endDate: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 7)).toISOString().split('T')[0],
      period: 'weekly'
    }
  }),

  actions: {

    async getConsumptionTrend(
      period:{
        startDate: string,
        endDate: string
      },
      options: {
        clusterId?: string,
        deviceId?: string,
        consumption_type?: 1 | 2, // 1 for usage and 2 for collection
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
            startDate:  period.startDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate:  period.endDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0],
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
      period:{
        startDate: string,
        endDate: string
      },
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
            startDate: period.startDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate: period.endDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
          },
          headers: {
            "Authorization": `Bearer ${useUserStore().token}`
          }
        })

        if (error.value) {
          throw new Error(error.value.data?.error || 'Failed to fetch total water consumption')
        }

        // Update the store with that state
        this.totalWaterConsumption = data.value;

        return data.value;

      } catch (error: any) {
        throw error;
      }
    },

    async getAverageDailyConsumption(
      period:{
        startDate: string,
        endDate: string
      },
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
            startDate: period.startDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate: period.endDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
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
      period:{
        startDate: string,
        endDate: string
      },
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
            startDate: period.startDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate: period.endDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
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
      period:{
        startDate: string,
        endDate: string
      },
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
            startDate: period.startDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate: period.endDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
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
      period:{
        startDate: string,
        endDate: string
      },
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
            startDate: period.startDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate: period.endDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
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
      period:{
        startDate: string,
        endDate: string
      },
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
            startDate: period.startDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate: period.endDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
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
      period:{
        startDate: string,
        endDate: string
      },
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
            startDate: period.startDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
            endDate: period.endDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
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

    updateTrendPeriod(startDate: string, endDate: string,period:string) {
      this.trendPeriod.startDate = startDate;
      this.trendPeriod.endDate = endDate;
      this.trendPeriod.period = period;
    },

    updateConsumptionStatsPeriod(startDate: string, endDate: string,period:string) {
      this.consumptionStatsPeriod.startDate = startDate;
      this.consumptionStatsPeriod.endDate = endDate;
      this.consumptionStatsPeriod.period = period;
    },


    updateClusterPeriod(startDate: string, endDate: string, period:string) {
      this.clusterPeriod.startDate = startDate;
      this.clusterPeriod.endDate = endDate;
      this.clusterPeriod.period = period;
    },

    updateClusterComparePeriod(startDate: string, endDate: string, period:string) {
      this.clusterComparePeriod.startDate = startDate;
      this.clusterComparePeriod.endDate = endDate;
      this.clusterComparePeriod.period = period;
    },

    updateClusterInsightsPeriod(startDate: string, endDate: string, period:string) {
      this.insightsPeriod.startDate = startDate;
      this.insightsPeriod.endDate = endDate;
      this.insightsPeriod.period = period;
    }


  },




})