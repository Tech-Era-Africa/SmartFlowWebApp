<template>
    <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-4">
        <!-- Header with Period Selector -->
        <div class="flex justify-between items-center mb-2">
            <div>
                <h2 class="text-lg font-bold">Cluster Comparison</h2>
                <p class="text-xs text-muted-foreground">Compare consumption patterns and efficiency metrics</p>
            </div>
            <PeriodFacetedFilter @onDateChanged="handleDateChange" />
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center h-64">
            <div class="flex flex-col items-center">
                <div class="h-8 w-8 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin mb-2"></div>
                <p class="text-sm text-muted-foreground">Loading cluster data...</p>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
            <AlertCircle class="h-12 w-12 text-red-500 mb-4" />
            <h3 class="text-lg font-semibold text-red-700">Unable to load comparison data</h3>
            <p class="text-sm text-red-600 mb-4">{{ error.message || 'An error occurred while fetching data' }}</p>
            <Button @click="refreshData" class="bg-red-100 text-red-700 hover:bg-red-200">Try Again</Button>
        </div>

        <!-- No Data State -->
        <div v-else-if="!hasData" class="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
            <Database class="h-12 w-12 text-gray-400 mb-4" />
            <h3 class="text-lg font-semibold text-gray-700">No comparison data available</h3>
            <p class="text-sm text-gray-600 mb-4">Try selecting a different time period or adding more devices to this cluster.</p>
            <Button @click="refreshData" class="bg-gray-200 text-gray-700 hover:bg-gray-300">Refresh Data</Button>
        </div>

        <!-- Content -->
        <div v-else>
            <!-- Cluster Comparison Chart -->
            <Card class="shadow-none mb-6">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">
                        Consumption by Cluster
                    </CardTitle>
                    <BarChart3 class="h-4 w-4 text-indigo-500" />
                </CardHeader>
                <CardContent>
                    <div class="h-80">
                        <ClientOnly>
                            <apexchart
                                type="bar"
                                height="100%"
                                :options="clusterComparisonOptions"
                                :series="clusterComparisonSeries">
                            </apexchart>
                        </ClientOnly>
                    </div>
                </CardContent>
            </Card>

            <!-- Efficiency Comparison -->
            <Card class="shadow-none mb-6">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">
                        Efficiency Comparison
                    </CardTitle>
                    <Award class="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Efficiency Radar Chart -->
                        <div class="h-64">
                            <ClientOnly>
                                <apexchart
                                    type="radar"
                                    height="100%"
                                    :options="efficiencyRadarOptions"
                                    :series="efficiencyRadarSeries">
                                </apexchart>
                            </ClientOnly>
                        </div>

                        <!-- Efficiency Rankings -->
                        <div>
                            <h3 class="text-sm font-medium mb-3">Cluster Rankings</h3>
                            <div class="space-y-4">
                                <div v-for="(cluster, index) in clusterRankings" :key="index" class="flex items-center">
                                    <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" :class="getClusterRankColor(index)">
                                        <span class="text-white text-xs font-bold">{{ index + 1 }}</span>
                                    </div>
                                    <div class="ml-3 flex-grow">
                                        <div class="flex justify-between">
                                            <span class="text-sm font-medium">{{ cluster.name }}</span>
                                            <span class="text-sm font-bold">{{ cluster.score }}%</span>
                                        </div>
                                        <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-1">
                                            <div class="h-full rounded-full" :style="`width: ${cluster.score}%`" :class="getClusterScoreColor(cluster.score)"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Consumption Trends -->
            <Card class="shadow-none mb-6">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">
                        Consumption Trends
                    </CardTitle>
                    <div class="h-4 w-4 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                    </div>
                </CardHeader>
                <CardContent>
                    <div class="h-64">
                        <ClientOnly>
                            <apexchart
                                type="line"
                                height="100%"
                                :options="trendChartOptions"
                                :series="trendChartSeries">
                            </apexchart>
                        </ClientOnly>
                    </div>
                </CardContent>
            </Card>

            <!-- Anomaly Detection -->
            <Card class="shadow-none">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">
                        Anomaly Detection
                    </CardTitle>
                    <div class="h-4 w-4 text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    </div>
                </CardHeader>
                <CardContent>
                    <div v-if="anomalies.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
                        <div class="h-12 w-12 text-green-500 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <h3 class="text-base font-medium text-gray-700">No anomalies detected</h3>
                        <p class="text-sm text-gray-500 mt-1">All clusters are operating within expected parameters</p>
                    </div>
                    <div v-else class="grid gap-4 md:grid-cols-2">
                        <div v-for="(anomaly, index) in anomalies" :key="index" class="bg-amber-50 p-4 rounded-lg border border-amber-100">
                            <div class="flex items-start">
                                <div class="mr-3 mt-1 p-2 rounded-full bg-amber-100">
                                    <component :is="anomaly.icon" class="h-4 w-4 text-amber-500" />
                                </div>
                                <div>
                                    <h3 class="text-sm font-semibold mb-1">{{ anomaly.title }}</h3>
                                    <p class="text-xs text-gray-600 mb-2">{{ anomaly.description }}</p>
                                    <div class="flex justify-between items-center">
                                        <span class="text-xs font-medium text-gray-500">{{ anomaly.date }}</span>
                                        <button class="px-2 py-1 text-xs bg-transparent hover:bg-amber-100 rounded">Investigate</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>

<script setup>
import {
    Droplet, Award, BarChart3,
    AlertCircle, Database, AlertTriangle
} from 'lucide-vue-next';
import { ref, onMounted, defineComponent, h } from 'vue';

// Import ClientOnly component for chart rendering
const ClientOnly = defineComponent({
    setup(_, { slots }) {
        return () => h('div', {}, slots.default && slots.default());
    }
});

// Mock ApexCharts component
const apexchart = defineComponent({
    props: ['type', 'height', 'options', 'series'],
    setup(props) {
        return () => h('div', {
            class: 'h-full flex items-center justify-center bg-gray-50 rounded-lg'
        }, [
            h('div', { class: 'text-center' }, [
                h('div', { class: 'h-10 w-10 text-gray-300 mx-auto mb-2' }, [
                    h('svg', {
                        xmlns: 'http://www.w3.org/2000/svg',
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: 'currentColor',
                        'stroke-width': '2',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                        class: 'h-full w-full'
                    }, [
                        props.type === 'bar' ? [
                            h('line', { x1: '18', y1: '20', x2: '18', y2: '10' }),
                            h('line', { x1: '12', y1: '20', x2: '12', y2: '4' }),
                            h('line', { x1: '6', y1: '20', x2: '6', y2: '14' })
                        ] : props.type === 'radar' ? [
                            h('polygon', { points: '12 2 19.5 8.5 18 16 12 20 6 16 4.5 8.5 12 2' })
                        ] : [
                            h('polyline', { points: '22 12 18 12 15 21 9 3 6 12 2 12' })
                        ]
                    ])
                ]),
                h('p', { class: 'text-sm text-gray-500' }, `${props.type.charAt(0).toUpperCase() + props.type.slice(1)} chart would appear here`),
                h('p', { class: 'text-xs text-gray-400' }, `Showing ${props.series.length} data series`)
            ])
        ]);
    }
});



// Button component
const Button = defineComponent({
    props: {
        variant: { type: String, default: 'default' },
        size: { type: String, default: 'default' }
    },
    setup(props, { slots }) {
        return () => h('button', {
            class: `px-4 py-2 rounded font-medium ${props.variant === 'outline' ? 'border border-gray-300 bg-transparent' : 'bg-gray-100 hover:bg-gray-200'} ${props.size === 'sm' ? 'text-xs py-1 px-2' : ''}`
        }, slots.default && slots.default());
    }
});

// Card components
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



const PeriodFacetedFilter = defineComponent({
    emits: ['onDateChanged'],
    setup(_, { emit }) {
        return () => h('button', {
            class: 'text-xs h-8 px-3 py-1 rounded border border-gray-300 bg-transparent flex items-center',
            onClick: () => emit('onDateChanged', { start: new Date(), end: new Date() })
        }, [
            'Last 30 Days ',
            h('svg', {
                class: 'ml-1 h-3 w-3',
                xmlns: 'http://www.w3.org/2000/svg',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                'stroke-width': '2',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round'
            }, [
                h('polyline', { points: '6 9 12 15 18 9' })
            ])
        ]);
    }
});

// Mock data for the dashboard
const isLoading = ref(false);
const error = ref(null);
const hasData = ref(true);

// Mock consumption data
const consumptionData = ref({
    unit: 'kL',
    comparisonPeriod: 'vs last month',
    currentPeriod: 'Feb 1 - Feb 28, 2024',
    consumption: {
        total: 780,
        percentageChange: -5.2
    },
    collection: {
        total: 1250,
        percentageChange: 12.3
    },
    saved: 470
});



// Mock cluster rankings
const clusterRankings = ref([
    { id: 'c3', name: 'Commercial Area', score: 92 },
    { id: 'c1', name: 'Residential Block A', score: 87 },
    { id: 'c4', name: 'Public Facilities', score: 78 },
    { id: 'c5', name: 'Industrial Zone', score: 65 },
    { id: 'c2', name: 'Residential Block B', score: 58 }
]);

// Mock anomalies
const anomalies = ref([
    {
        id: 'a1',
        clusterId: 'c2',
        title: 'Unusual consumption spike',
        description: 'Residential Block B showed a 45% increase in consumption on Tuesday',
        date: 'May 15, 2024',
        icon: AlertTriangle
    },
    {
        id: 'a2',
        clusterId: 'c5',
        title: 'Potential leak detected',
        description: 'Industrial Zone has continuous flow during non-operational hours',
        date: 'May 17, 2024',
        icon: Droplet
    }
]);

// Helper functions for cluster visualization
const getClusterRankColor = (index) => {
    const colors = [
        'bg-green-500', // 1st place
        'bg-teal-500',  // 2nd place
        'bg-blue-500',  // 3rd place
        'bg-indigo-500', // 4th place
        'bg-purple-500'  // 5th place
    ];
    return colors[index] || 'bg-gray-500';
};

const getClusterScoreColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-teal-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 60) return 'bg-indigo-500';
    return 'bg-purple-500';
};

// Computed values for efficiency metrics
const collectionEfficiency = ref(85);
const usageOptimization = ref(72);

// Chart configurations and data
const clusterComparisonSeries = ref([
    {
        name: 'Consumption (kL)',
        data: [780, 650, 420, 380, 290]
    },
    {
        name: 'Collection (kL)',
        data: [1250, 980, 720, 510, 380]
    },
    {
        name: 'Saved (kL)',
        data: [470, 330, 300, 130, 90]
    }
]);

const clusterComparisonOptions = ref({
    chart: {
        type: 'bar',
        stacked: false,
        toolbar: {
            show: true
        },
        zoom: {
            enabled: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 4
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories: ['Commercial Area', 'Residential Block A', 'Public Facilities', 'Industrial Zone', 'Residential Block B'],
    },
    yaxis: {
        title: {
            text: 'Volume (kL)'
        }
    },
    fill: {
        opacity: 1
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + " kL"
            }
        }
    },
    colors: ['#3b82f6', '#06b6d4', '#10b981']
});

const efficiencyRadarSeries = ref([
    {
        name: 'Commercial Area',
        data: [92, 88, 95, 85, 98]
    },
    {
        name: 'Residential Block A',
        data: [87, 90, 80, 95, 82]
    },
    {
        name: 'Public Facilities',
        data: [78, 85, 75, 70, 80]
    }
]);

const efficiencyRadarOptions = ref({
    chart: {
        type: 'radar',
        toolbar: {
            show: true
        },
    },
    xaxis: {
        categories: ['Overall Efficiency', 'Collection Efficiency', 'Conservation Rate', 'Usage Optimization', 'Maintenance']
    },
    yaxis: {
        show: false,
        max: 100
    },
    fill: {
        opacity: 0.3
    },
    stroke: {
        width: 2
    },
    markers: {
        size: 4
    },
    colors: ['#10b981', '#3b82f6', '#6366f1']
});

const trendChartSeries = ref([
    {
        name: 'Commercial Area',
        data: [42, 45, 38, 40, 45, 50, 48, 52, 55, 58, 56, 60]
    },
    {
        name: 'Residential Block A',
        data: [35, 38, 32, 36, 40, 42, 45, 48, 44, 42, 40, 45]
    },
    {
        name: 'Public Facilities',
        data: [28, 30, 25, 28, 32, 35, 30, 28, 32, 35, 38, 36]
    },
    {
        name: 'Industrial Zone',
        data: [25, 28, 22, 25, 30, 32, 28, 25, 28, 30, 32, 30]
    },
    {
        name: 'Residential Block B',
        data: [20, 22, 18, 20, 24, 26, 22, 20, 22, 24, 26, 24]
    }
]);

const trendChartOptions = ref({
    chart: {
        type: 'line',
        toolbar: {
            show: true
        },
        zoom: {
            enabled: true
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    grid: {
        row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
        },
    },
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yaxis: {
        title: {
            text: 'Consumption (kL)'
        }
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + " kL"
            }
        }
    },
    colors: ['#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899']
});

// Methods
const handleDateChange = (dates) => {
    console.log('Date changed:', dates);
    refreshData();
};

const refreshData = () => {
    isLoading.value = true;

    // Simulate API call
    setTimeout(() => {
        isLoading.value = false;

        // Randomly update some values to simulate data refresh
        consumptionData.value.consumption.total = 780 + (Math.random() * 100 - 50);
        consumptionData.value.collection.total = 1250 + (Math.random() * 150 - 75);
        consumptionData.value.saved = 470 + (Math.random() * 80 - 40);

        // Update efficiency metrics
        collectionEfficiency.value = Math.min(100, Math.max(50, collectionEfficiency.value + (Math.random() * 10 - 5)));
        usageOptimization.value = Math.min(100, Math.max(50, usageOptimization.value + (Math.random() * 10 - 5)));

        // Update cluster rankings
        clusterRankings.value = clusterRankings.value.map(cluster => ({
            ...cluster,
            score: Math.min(100, Math.max(50, cluster.score + (Math.random() * 10 - 5)))
        }));

        // Sort rankings by score
        clusterRankings.value.sort((a, b) => b.score - a.score);

        // Update chart data
        clusterComparisonSeries.value = clusterComparisonSeries.value.map(series => ({
            ...series,
            data: series.data.map(val => Math.max(0, val + (Math.random() * 50 - 25)))
        }));

        efficiencyRadarSeries.value = efficiencyRadarSeries.value.map(series => ({
            ...series,
            data: series.data.map(val => Math.min(100, Math.max(50, val + (Math.random() * 10 - 5))))
        }));

        trendChartSeries.value = trendChartSeries.value.map(series => ({
            ...series,
            data: series.data.map(val => Math.max(0, val + (Math.random() * 5 - 2.5)))
        }));

        // Randomly show or hide anomalies
        if (Math.random() > 0.7) {
            anomalies.value = [];
        }
    }, 1500);
};

// Initialize data on component mount
onMounted(() => {
    // In a real implementation, this would fetch data from the API
    // For now, we're using the mock data defined above
});
</script>