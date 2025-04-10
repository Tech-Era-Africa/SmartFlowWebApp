<script setup lang="ts">
import { useBillStore } from '~/stores/bill/bill.store';
import { useDeviceStore } from '~/stores/device/device.store';
import { ArrowLeftCircle, Plus } from 'lucide-vue-next'
// import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';
import type { IDevice } from '~/stores/device/model/device.model';
import type { IBillOptionDTO } from '~/stores/bill/dto/billOption.dto';
import { useClusterStore } from '~/stores/cluster/cluster.store';
// import { useToast } from '~/components/ui/toast/use-toast';
import ClusterInsights from '~/components/ClusterInsights.vue';
import type { ICluster } from '~/stores/cluster/model/cluster.model';

useHead({ title: "Devices" })

const deviceStore = useDeviceStore()
const clusterStore = useClusterStore()

const billStore = useBillStore()
const clusterId = useRoute().params.id

// Load cluster details
const { data: clusterData, refresh: refreshClusterDetails, status: statusClusterDetails } = await useAsyncData<ICluster>('clusterDetails', () => clusterStore.getClusterDetails(clusterId.toString()), { lazy: true, immediate: true })

//Load cluster devices
const { data: clusterDevices, refresh, status } = await useAsyncData<any>('clusterDevices', () => deviceStore.getClusterDevices(clusterId[0]), { lazy: true })


const billWidgetOption = ref<IBillOptionDTO>({ billTypeId: billStore.billTypes[0].id } as IBillOptionDTO)







</script>

<template>
    <NuxtLayout name="dashboard">
        <Header name="Devices"></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10  mx-2  lg:mx-8 left-0 right-0 min-h-[400px]">
            <div class="w-full flex h-full p-2 gap-4">
                <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col justify-between gap-5">
                    <div class="flex flex-row justify-between gap-2 items-center">
                        <div class="flex gap-5 items-center">
                            <Button variant="outline" @click="useRouter().back()">
                                <ArrowLeftCircle></ArrowLeftCircle>
                            </Button>
                            <div>
                                <Skeleton v-if="statusClusterDetails == 'pending'" class="w-500 h-10 rounded-lg">
                                </Skeleton>
                                <template v-else>
                                    <Badge v-if="clusterData?.type"
                                        :class="clusterData?.type.id == 1 ? 'hover:bg-transparent bg-green-100 text-green-600' : 'hover:bg-transparent bg-blue-100 text-blue-600'"
                                        class="rounded-sm border-none outline-none my-3 text-xs inline-flex w-fit">
                                        {{ clusterData?.type.name }}
                                    </Badge>
                                    <h1 class="text-3xl font-extrabold">{{ clusterData?.name || 'Cluster' }}</h1>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- LOADING -->
                    <template v-if="statusClusterDetails == 'pending'">
                        <div class="flex flex-col  gap-4 p-5">
                            <div class="flex  w-full">
                                <div class="w-full md:w-2/3 md:mr-4">
                                    <Skeleton class="h-[300px] w-full rounded-lg" />
                                </div>
                                <div class="w-full md:w-1/3 mt-4 md:mt-0">
                                    <Skeleton class="h-[300px] w-full rounded-lg" />
                                </div>
                            </div>
                            <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                <div v-for="i in 6" :key="i" class="space-y-3">
                                    <Skeleton class="h-[120px] w-full rounded-lg" />
                                    <div class="space-y-2">
                                        <Skeleton class="h-4 w-3/4" />
                                        <Skeleton class="h-3 w-1/2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <!-- end of LOADING -->

                    <div v-if="statusClusterDetails == 'success' && clusterData?.device_count == 0" class="w-full h-[400px] flex flex-col justify-center items-center bg-gray-50 rounded-lg">
                        <p class="text-xl font-semibold text-gray-600">No Devices Found In This Cluster</p>
                        <p class="text-gray-400 mt-2">Add a new device to get started</p>
                        <Button  class="mt-6" variant="outline">
                            Add New Device <Plus class="ml-2" :size="16"></Plus>
                        </Button>
                    </div>

                    <template v-else>


                        <!-- Insights -->
                        <section class="mb-6">
                            <div class="flex gap-5 items-center  mb-5 ml-5">
                                <h1 class="font-bold text-lg">Insights</h1>
                                <PeriodFacetedFilter></PeriodFacetedFilter>
                            </div>

                            <ClusterInsights cluster-id="" />
                        </section>
                        <!-- end of Insights -->

                        <!-- TREND -->
                        <section class="flex w-full gap-4 mb-10">
                            <div class="w-2/3">
                                <WaterConsumptionChart
                                    class="border-[0.5px]"
                                    :option="{ title: 'Consumption Trend', subtitle: 'Track your collection, consumption, and savings' }">
                                </WaterConsumptionChart>
                            </div>

                            <TotalPayableBillWidget class="flex-1" :option="billWidgetOption">
                                <div class="text-right">
                                    <p class="text-xs text-gray-500">Consumption</p>
                                    <p class="font-bold flex justify-end items-center gap-2">
                                        <span v-if="deviceStore.loading_TotalClusterConsumption"
                                            class="loading loading-spinner loading-xs text-gray-400"></span>
                                        <span>{{ 0 }}k L</span>
                                    </p>
                                </div>
                            </TotalPayableBillWidget>
                        </section>
                        <!-- end of TREND -->


                    </template>

                </div>
            </div>
        </section>
    </NuxtLayout>
</template>
