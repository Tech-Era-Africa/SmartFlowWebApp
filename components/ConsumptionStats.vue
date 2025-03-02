<template>
    <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-2">
      
       <div v-if="consumptionStore.isLoadingConsumptionInsights" class="grid gap-4 md:grid-cols-2">
           <Card v-for="i in 4" :key="i" class="shadow-none">
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle class="text-sm font-medium">
                       <Skeleton class="h-4 w-24" />
                   </CardTitle>
                   <Skeleton class="h-4 w-4 rounded-full" />
               </CardHeader>
               <CardContent>
                   <Skeleton class="h-6 w-16 mb-2" />
                   <Skeleton class="h-4 w-32" />
               </CardContent>
           </Card>
       </div>
       <div v-else class="grid gap-4 md:grid-cols-2">
          
           <!-- Water Collection -->
           <Card class="shadow-none transition-opacity duration-300">
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle class="text-sm font-medium">
                       Water Collected
                   </CardTitle>
                   <Droplet class="h-4 w-4 text-blue-500" />
               </CardHeader>
               <CardContent>
                   <div class="text-lg font-bold">
                       {{ consumptionStore.stats.waterCollected }} kL
                   </div>
                   <p class="text-xs text-muted-foreground">
                       {{ consumptionStore.stats.waterCollectedChange > 0 ? '+' : '' }}{{ consumptionStore.stats.waterCollectedChange }}% since last period
                   </p>
                   <div class="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                       <div class="h-full bg-blue-500 rounded-full" :style="`width: ${consumptionStore.stats.collectionEfficiency}%`"></div>
                   </div>
                   <p class="text-xs text-muted-foreground mt-1">
                       {{ consumptionStore.stats.collectionEfficiency }}% of target
                   </p>
               </CardContent>
           </Card>
           
           <!-- Water Consumed -->
           <Card class="shadow-none transition-opacity duration-300">
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle class="text-sm font-medium">
                       Water Consumed
                   </CardTitle>
                   <Gauge class="h-4 w-4 text-red-500" />
               </CardHeader>
               <CardContent>
                   <div class="text-lg font-bold">
                       {{ consumptionStore.stats.waterUsed }} kL
                   </div>
                   <p class="text-xs text-muted-foreground">
                       {{ consumptionStore.stats.waterUsedChangeDescription }}
                   </p>
                   <div class="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                       <div class="h-full bg-red-500 rounded-full" :style="`width: ${consumptionStore.stats.consumptionRate}%`"></div>
                   </div>
                   <p class="text-xs text-muted-foreground mt-1">
                       {{ consumptionStore.stats.consumptionRate }}% of collected water
                   </p>
               </CardContent>
           </Card>
           
           <!-- Water Saved -->
           <Card class="shadow-none transition-opacity duration-300 md:col-span-2">
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle class="text-sm font-medium">
                       Water Saved
                   </CardTitle>
                   <Save class="h-4 w-4 text-green-500" />
               </CardHeader>
               <CardContent>
                   <div class="text-lg font-bold">
                       {{ consumptionStore.stats.waterSaved }} kL
                   </div>
                   <p class="text-xs text-muted-foreground">
                       {{ consumptionStore.stats.waterSavedChange > 0 ? '+' : '' }}{{ consumptionStore.stats.waterSavedChange }}% since last period
                   </p>
                   <div class="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                       <div class="h-full bg-green-500 rounded-full" :style="`width: ${consumptionStore.stats.conservationRate}%`"></div>
                   </div>
                   <p class="text-xs text-muted-foreground mt-1">
                       {{ consumptionStore.stats.conservationRate }}% conservation rate
                   </p>
               </CardContent>
           </Card>

            <!-- Cost Analysis -->
            <Card class="shadow-none md:col-span-2">
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle class="text-sm font-medium">
                       Cost Analysis
                   </CardTitle>
                   <DollarSign class="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                   <div class="flex justify-between items-center">
                       <div>
                           <p class="text-sm text-muted-foreground">Water Bill</p>
                           <p class="text-lg font-bold">
                               GHC{{ billStore.calculateTotalBill({ consumption: +consumptionStore.stats.waterUsed }) }}
                           </p>
                       </div>
                       <div>
                           <p class="text-sm text-muted-foreground">Savings</p>
                           <p class="text-lg font-bold text-green-500">
                               GHC{{ consumptionStore.stats.waterSavingsCost }}
                           </p>
                       </div>
                   </div>
                   <div class="mt-4">
                       <div class="flex justify-between text-xs mb-1">
                           <span>This Month</span>
                           <span>Previous</span>
                       </div>
                       <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                           <div class="h-full bg-blue-500 rounded-full" :style="`width: ${consumptionStore.stats.costComparisonPercentage}%`"></div>
                       </div>
                       <p class="text-xs text-muted-foreground mt-1">
                           {{ costChangeDescription }}
                       </p>
                   </div>
               </CardContent>
           </Card>
       </div>
       
    </div>
</template>
<script setup lang="ts">
import { useConsumptionStore } from '~/stores/consumption/consumption.store';
import { useDeviceStore } from '~/stores/device/device.store';
import { useBillStore } from '~/stores/bill/bill.store.js';
import { 
    Droplet, Gauge, Save, TrendingUp, DollarSign, 
    Activity, Award, Lightbulb, MoreHorizontal 
} from 'lucide-vue-next';


const props = defineProps({
   option: {
       type: Object as PropType<{ title?:string, subtitle?:string, isLoading?:boolean, max:number, min:number, sum:number }>,
       required: true
   },
})

// Create a consumptionStore with reactive data for the dashboard
const consumptionStore = ref({
    isLoadingConsumptionInsights: false,
    stats: {
        // Original stats from your template
        waterUsed: 780,
        waterUsedChange: -5,
        waterUsedChangeDescription: "-5% since last period",
        estimatedBill: true,
        peakUsageAmount: 42,
        peakUsageDate: "15 Feb 2025",
        peakUsageGroup: "1",
        averageConsumption: 25.6,
        
        // New stats for enhanced dashboard
        waterCollected: 1250,
        waterCollectedChange: 12,
        waterSaved: 470,
        waterSavedChange: 23,
        collectionEfficiency: 85,
        consumptionRate: 62,
        conservationRate: 38,
        usageOptimization: 72,
        efficiencyScore: 73,
        waterSavingsCost: 850,
        costComparisonPercentage: 75
    }
});

// const consumptionStore = useConsumptionStore()
const billStore = useBillStore();


const handleClusterFilter = (selectedClusters: string[]) => {
  
};

const deviceStore = useDeviceStore()
const getDeviceGroupName = (id:string) => {

   const group = deviceStore.devicesGroups.find(group => group.objectId === id);
   return group ? group.name : 'Unknown Group';

};


const onDateChanged = (period: {start:Date, end:Date}) => {
   consumptionStore.getConsumptionInsightsByOrg(period.start.toISOString(), period.end.toISOString())
}

useAsyncData('consumptionInsights', async () => {
 const currentDate = new Date();
 const startDate = new Date(currentDate.getFullYear(), 0, 1);
 const endDate = new Date(currentDate.getFullYear(), 11, 31);
 await consumptionStore.getConsumptionInsightsByOrg(startDate.toISOString(), endDate.toISOString());
}, {lazy:true});
</script>