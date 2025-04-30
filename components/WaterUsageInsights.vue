<template>
    <div class="w-full h-full bg-white  rounded-xl p-5 flex flex-col gap-4">
        <!-- Header with Period Selector -->
        <div class="flex justify-between items-center mb-4">
            <div>
                <h2 class="text-lg font-bold">Your Water Story</h2>
                <p class="text-xs text-muted-foreground">How your buildings are using and saving water</p>
            </div>
            <PeriodFacetedFilter @on-date-changed="handleWaterStoryDateChange" />
        </div>

        

        <!-- Content -->
        <div >
            <!-- Water Usage Visualization -->
            <!-- <WaterUsageVisualization /> -->

            <!-- Building Comparison -->
            <BuildingComparison />

            <!-- Water System Health -->
            <!-- <WaterSystemHealth /> -->

            <!-- Ways to Save Water -->
            <!-- <WaterSavingOpportunities /> -->

            <!-- Anomaly Detection -->
            <!-- <SystemAlerts /> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { useConsumptionStore } from '~/stores/consumption/consumption.store';


const consumptionStore = useConsumptionStore()

// Handle date changed
const handleWaterStoryDateChange = (value:any) => {
    consumptionStore.updateClusterComparePeriod(value.start.toISOString(), value.end.toISOString(), value.period)
};


</script>
