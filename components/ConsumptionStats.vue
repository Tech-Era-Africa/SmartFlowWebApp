<script setup lang="ts">

import { useConsumptionStore } from '~/stores/consumption/consumption.store';
import { useBillStore } from '~/stores/bill/bill.store';
import { Droplet, Gauge, Save, DollarSign } from 'lucide-vue-next';

const consumptionStore = useConsumptionStore();
const billStore = useBillStore();

// Fetch water insights
const { data, refresh, status, error } = useAsyncData('waterInsights', async () => {
  return await consumptionStore.getInsights(consumptionStore.consumptionStatsPeriod);
}, { immediate: true, lazy: true });

// Listen to when the dates change and refresh
watch(
  () =>  
    consumptionStore.consumptionStatsPeriod,
  async () => {
    await refresh();
  },
  { immediate: true, deep:true }
);

// Keeps track of the percentage of water consumed against the amount stored
const percentageOfConsumed = computed(() => {
    if(!data.value?.consumption?.total || !data.value?.collection?.total) return 0;
    return Math.round((data.value?.consumption?.total / data.value?.collection?.total) * 100);
});

// Keeps track of the percentage of water collected against the target
const percentageCollectedAgainstTarget = computed(() => {
    const target = consumptionStore.collectionTarget;
    if(!data.value?.collection?.total || !data.value?.collection?.total) return 0;
    return Math.round((data.value?.collection?.total / target) * 100);
});

//Conservation rate = total saved / total collected * 100
const conservationRate = computed(() => {
    if(!data.value?.saved || !data.value?.collection?.total) return 0;
    return Math.round((data.value?.saved / data.value?.collection?.total) * 100);
});

//Saved bill = total consumed
const savedBill = computed(() => {
    if(!data.value?.consumption?.total || !data.value?.saved) return 0;
    return billStore.calculateTotalBill({ consumption: data.value?.saved ?? 0 }) 
});

const percentageSaved = computed(() => {
    if(!data.value?.saved || !data.value?.consumption?.total) return 0;
    return (data.value?.saved / data.value?.consumption?.total) * 100;
});

const savedMessage = computed(() => {
    return `You saved ${currencyFormat(savedBill.value)} by conserving ${formatNumber(data.value?.saved ?? 0)} kL of water compared to the previous period`;
});

const currencyFormat = (number: number) => new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS'
}).format(number);

const formatNumber = (number: number) => new Intl.NumberFormat('en-GH').format(number);

</script>
<template>
    <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-2">
       <div v-if="status == 'pending'" class="grid gap-4 md:grid-cols-2">
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
       <div v-if="status == 'success'"  class="grid gap-4 md:grid-cols-2">


          
           <!-- Water Collection -->
           <Card class="shadow-none transition-opacity duration-300">
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle class="text-sm font-medium">
                       Water Collected
                   </CardTitle>
                   <Droplet class="h-4 w-4 text-green-500" />
               </CardHeader>
               <CardContent>
                   <div class="text-lg font-bold">
                       {{ formatNumber(data?.collection?.total ?? 0) }} {{ data?.unit }}
                   </div>
                   <p v-if="data?.collection" class="text-xs text-muted-foreground">
                       {{ data?.collection?.percentageChange > 0 ? '+' : '' }}{{ data?.collection?.percentageChange }}% {{ data?.comparisonPeriod }}
                   </p>
                   <div class="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                       <div class="h-full bg-green-500 rounded-full" :style="`width: ${percentageCollectedAgainstTarget}%`"></div>
                   </div>
                   <p class="text-xs text-muted-foreground mt-1">
                       {{ percentageCollectedAgainstTarget }}% of target ({{ consumptionStore.collectionTarget }} kL)
                   </p>
               </CardContent>
           </Card>
           
           <!-- Water Consumed -->
           <Card class="shadow-none transition-opacity duration-300">
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle class="text-sm font-medium">
                       Water Consumed
                   </CardTitle>
                   <Gauge class="h-4 w-4 text-blue-500" />
               </CardHeader>
               <CardContent>
                   <div class="text-lg font-bold">
                       {{ formatNumber(data?.consumption?.total ?? 0) }} {{ data?.unit}}
                   </div>
                   <p v-if="data?.consumption" class="text-xs text-muted-foreground">
                    {{ data?.consumption?.percentageChange > 0 ? '+' : '' }}{{ data?.consumption?.percentageChange }}% {{ data?.comparisonPeriod }}
                   </p>
                   <div class="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                       <div class="h-full bg-blue-500 rounded-full" :style="`width: ${percentageOfConsumed}%`"></div>
                   </div>
                   <p class="text-xs text-muted-foreground mt-1">
                       {{ percentageOfConsumed }}% of collected water
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
                       {{ formatNumber(data?.saved ?? 0)}} kL
                   </div>
                   <p v-if="data?.consumption" class="text-xs text-muted-foreground">
                    {{ data?.consumption?.percentageChange > 0 ? '+' : '' }}{{ data?.consumption?.percentageChange }}% {{ data?.comparisonPeriod }}
                   </p>
                   <div class="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                       <div :class="{ 'bg-red-500': conservationRate < 0, 'bg-green-500': conservationRate >= 0 }" class="h-full rounded-full" :style="`width: ${conservationRate}%`"></div>
                   </div>
                   <p class="text-xs text-muted-foreground mt-1">
                       {{ conservationRate }}% conservation rate
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
                               {{ currencyFormat(billStore.calculateTotalBill({ consumption: data?.consumption.total ?? 0 })) }}
                           </p>
                       </div>
                       <div>
                           <p class="text-sm text-muted-foreground">Savings</p>
                           <p class="text-lg font-bold " :class="{ 'text-red-500': percentageSaved < 0, 'text-green-500': percentageSaved >= 0 }">
                               {{ currencyFormat(savedBill) }}
                           </p>
                       </div>
                   </div>
                   <div class="mt-4">
                       <!-- <div class="flex justify-between text-xs mb-1">
                           <span>This period</span>
                           <span>{{ data?.comparisonPeriod }}</span>
                       </div> -->
                       <!-- <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                           <div class="h-full bg-blue-500 rounded-full" :style="`width: ${percentageSaved}%`"></div>
                       </div> -->
                       <p class="text-xs text-muted-foreground mt-1">
                           {{ savedMessage }}
                       </p>
                   </div>
               </CardContent>
           </Card>
       </div>
       
    </div>
</template>
