<template>
    <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-4">
       
       <!-- Loading State -->
       <div v-if="consumptionStore.isLoadingConsumptionInsights" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
           <Card v-for="i in 6" :key="i" class="shadow-none">
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
       
       <!-- Content -->
       <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            
           
           <!-- Efficiency Score -->
           <Card class="shadow-none md:col-span-2 lg:col-span-3">
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle class="text-sm font-medium">
                       Overall Water Efficiency Score
                   </CardTitle>
                   <Award class="h-4 w-4 text-yellow-500" />
               </CardHeader>
               <CardContent>
                   <div class="flex flex-col md:flex-row items-center justify-between">
                       <div class="mb-4 md:mb-0">
                           <div class="relative h-32 w-32">
                               <RadialProgress :progress="consumptionStore.stats.efficiencyScore" :color="efficiencyColor" />
                               <div class="absolute inset-0 flex items-center justify-center">
                                   <span class="text-2xl font-bold">{{ consumptionStore.stats.efficiencyScore }}%</span>
                               </div>
                           </div>
                       </div>
                       <div class="flex-1 md:ml-6">
                           <div class="space-y-4">
                               <div>
                                   <div class="flex justify-between mb-1">
                                       <span class="text-sm">Collection Efficiency</span>
                                       <span class="text-sm font-bold">{{ consumptionStore.stats.collectionEfficiency }}%</span>
                                   </div>
                                   <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                       <div class="h-full bg-blue-500 rounded-full" :style="`width: ${consumptionStore.stats.collectionEfficiency}%`"></div>
                                   </div>
                               </div>
                               <div>
                                   <div class="flex justify-between mb-1">
                                       <span class="text-sm">Conservation Rate</span>
                                       <span class="text-sm font-bold">{{ consumptionStore.stats.conservationRate }}%</span>
                                   </div>
                                   <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                       <div class="h-full bg-green-500 rounded-full" :style="`width: ${consumptionStore.stats.conservationRate}%`"></div>
                                   </div>
                               </div>
                               <div>
                                   <div class="flex justify-between mb-1">
                                       <span class="text-sm">Usage Optimization</span>
                                       <span class="text-sm font-bold">{{ consumptionStore.stats.usageOptimization }}%</span>
                                   </div>
                                   <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                       <div class="h-full bg-purple-500 rounded-full" :style="`width: ${consumptionStore.stats.usageOptimization}%`"></div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               </CardContent>
           </Card>
           
           <!-- Conservation Tips -->
           <Card class="shadow-none md:col-span-2 lg:col-span-3">
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle class="text-sm font-medium">
                       Improvement Opportunities
                   </CardTitle>
                   <Lightbulb class="h-4 w-4 text-yellow-500" />
               </CardHeader>
               <CardContent>
                   <div class="grid gap-4 md:grid-cols-3">
                       <div v-for="(tip, index) in improvementTips" :key="index" class="bg-gray-50 p-3 rounded-lg">
                           <div class="flex items-start mb-2">
                               <div class="mr-2 mt-1">
                                   <component :is="tip.icon" class="h-4 w-4" :class="tip.iconColor" />
                               </div>
                               <h3 class="text-sm font-semibold">{{ tip.title }}</h3>
                           </div>
                           <p class="text-xs text-gray-600">{{ tip.description }}</p>
                           <div class="mt-2 flex justify-between items-center">
                               <span class="text-xs font-medium" :class="tip.savingsColor">{{ tip.potentialSavings }}</span>
                               <Button size="sm" variant="ghost" class="h-7 text-xs">Learn More</Button>
                           </div>
                       </div>
                   </div>
               </CardContent>
           </Card>
       </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent, h } from 'vue';
import { 
    Droplet, Gauge, Save, TrendingUp, DollarSign, 
    Activity, Award, Lightbulb, MoreHorizontal 
} from 'lucide-vue-next';

// Create dummy option
const option = ref({
    title: 'Water Management Insights',
    subtitle: 'Track your collection, consumption, and savings'
});

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

// Create a billStore to handle bill calculations
const billStore = {
    calculateTotalBill: ({ consumption }) => {
        // Simple calculation for demo purposes
        // In a real implementation, this would use proper billing rates
        const baseRate = 1.5;
        const additionalFees = 150;
        return (consumption * baseRate + additionalFees).toFixed(2);
    }
};

// Chart data
const waterBalanceData = ref([
    { month: 'Current Period', Collected: 1250, Consumed: 780, Saved: 470 },
    { month: 'Previous Period', Collected: 1100, Consumed: 820, Saved: 280 }
]);

const usageTrendData = ref([
    { month: 'Sep', Collected: 950, Consumed: 680, Saved: 270 },
    { month: 'Oct', Collected: 980, Consumed: 720, Saved: 260 },
    { month: 'Nov', Collected: 1050, Consumed: 750, Saved: 300 },
    { month: 'Dec', Collected: 1120, Consumed: 820, Saved: 300 },
    { month: 'Jan', Collected: 1100, Consumed: 820, Saved: 280 },
    { month: 'Feb', Collected: 1250, Consumed: 780, Saved: 470 }
]);

// Computed values
const efficiencyColor = computed(() => {
    if (consumptionStore.value.stats.efficiencyScore >= 80) return 'text-green-500';
    if (consumptionStore.value.stats.efficiencyScore >= 60) return 'text-yellow-500';
    return 'text-red-500';
});

const costChangeDescription = computed(() => {
    const percentage = consumptionStore.value.stats.costComparisonPercentage;
    return percentage < 100 
        ? `Spending ${100 - percentage}% less than previous period` 
        : `Spending ${percentage - 100}% more than previous period`;
});

// Improvement tips
const improvementTips = ref([
    {
        title: 'Optimize Collection',
        description: 'Increase your water collection efficiency by expanding catchment areas by 10%.',
        potentialSavings: '+120 kL potential',
        icon: Droplet,
        iconColor: 'text-blue-500',
        savingsColor: 'text-blue-500'
    },
    {
        title: 'Reduce Leakage',
        description: 'Fix identified leaks in Block B to prevent unnecessary water loss.',
        potentialSavings: '-85 kL consumption',
        icon: Gauge,
        iconColor: 'text-red-500',
        savingsColor: 'text-green-500'
    },
    {
        title: 'Optimize Usage Times',
        description: 'Shift high-usage activities to off-peak hours for better distribution.',
        potentialSavings: '+15% efficiency',
        icon: Activity,
        iconColor: 'text-purple-500',
        savingsColor: 'text-purple-500'
    }
]);

// Methods
const exportData = () => {
    // Implement export functionality
    console.log('Exporting data...');
};

const printReport = () => {
    // Implement print functionality
    console.log('Printing report...');
};

const onDateChanged = (dates) => {
    // Handle date change, would update data in actual implementation
    console.log('Date changed:', dates);
    
    // In a real implementation, this would trigger a data refresh
    // For demo, we'll simulate a loading state
    consumptionStore.value.isLoadingConsumptionInsights = true;
    
    setTimeout(() => {
        consumptionStore.value.isLoadingConsumptionInsights = false;
    }, 1000);
};

// Function to get device group name (preserved from original code)
const getDeviceGroupName = (groupId) => {
    // In actual implementation, this would map to real group names
    const groups = {
        '1': 'Residential Block A',
        '2': 'Residential Block B',
        '3': 'Commercial Area',
        '4': 'Public Facilities'
    };
    return groups[groupId] || groupId;
};

// Component implementations
const BarChart = defineComponent({
    props: ['data', 'categories', 'colors'],
    setup(props) {
        return () => h('div', { class: 'w-full h-full bg-gray-50 rounded-lg flex items-center justify-center' }, [
            h('div', { class: 'text-sm text-gray-500' }, 'Bar Chart Visualization')
        ]);
    }
});

const LineChart = defineComponent({
    props: ['data', 'categories', 'colors'],
    setup(props) {
        return () => h('div', { class: 'w-full h-full bg-gray-50 rounded-lg flex items-center justify-center' }, [
            h('div', { class: 'text-sm text-gray-500' }, 'Line Chart Visualization')
        ]);
    }
});

const RadialProgress = defineComponent({
    props: ['progress', 'color'],
    setup(props) {
        return () => h('div', { 
            class: 'w-full h-full rounded-full border-4 border-gray-200 flex items-center justify-center' 
        }, [
            // h('div', { class: 'text-sm text-gray-500' }, `${props.progress}%`)
        ]);
    }
});

// Other required components for placeholder purposes
const Card = defineComponent({
    setup(_, { slots }) {
        return () => h('div', { class: 'bg-white border rounded-lg' }, slots.default && slots.default());
    }
});

const CardHeader = defineComponent({
    setup(_, { slots }) {
        return () => h('div', { class: 'p-4 pb-0' }, slots.default && slots.default());
    }
});

const CardContent = defineComponent({
    setup(_, { slots }) {
        return () => h('div', { class: 'p-4' }, slots.default && slots.default());
    }
});

const CardTitle = defineComponent({
    setup(_, { slots }) {
        return () => h('h3', { class: 'font-medium' }, slots.default && slots.default());
    }
});

const Skeleton = defineComponent({
    setup(_, { attrs }) {
        return () => h('div', { 
            class: 'bg-gray-200 animate-pulse rounded',
            style: { 
                width: attrs.class && attrs.class.includes('w-') ? undefined : '100%',
                height: attrs.class && attrs.class.includes('h-') ? undefined : '1rem'
            }
        });
    }
});

const Button = defineComponent({
    props: ['variant', 'size'],
    setup(props, { slots }) {
        return () => h('button', { 
            class: 'px-3 py-1 rounded text-sm bg-gray-100 hover:bg-gray-200'
        }, slots.default && slots.default());
    }
});

const DropdownMenu = defineComponent({
    setup(_, { slots }) {
        return () => h('div', { class: 'relative' }, slots.default && slots.default());
    }
});

const DropdownMenuTrigger = defineComponent({
    props: ['asChild'],
    setup(_, { slots }) {
        return () => slots.default ? slots.default() : null;
    }
});

const DropdownMenuContent = defineComponent({
    props: ['align'],
    setup(_, { slots }) {
        return () => h('div', { 
            class: 'absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border py-1 z-10 hidden'
        }, slots.default && slots.default());
    }
});

const DropdownMenuItem = defineComponent({
    setup(_, { slots }) {
        return () => h('button', { 
            class: 'w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
        }, slots.default && slots.default());
    }
});

const PeriodFacetedFilter = defineComponent({
    emits: ['onDateChanged'],
    setup(props, { emit }) {
        return () => h('button', { 
            class: 'text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded',
            onClick: () => emit('onDateChanged', { start: new Date(), end: new Date() })
        }, 'Last 30 Days ▾');
    }
});
</script>