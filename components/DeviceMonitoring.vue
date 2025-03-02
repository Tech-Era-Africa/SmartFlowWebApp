<template>

    <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex  justify-between items-center">
            <h1 class="font-bold text-lg">{{ title ?? 'Device Monitoring' }}</h1>
            <!-- <button class="btn">
                Device A
                <Icon name="ion:caret-down-outline" />
            </button> -->
        </div>
        <div class="flex-1 flex flex-col lg:flex-row gap-2">
            <div class="w-full flex flex-col gap-2">
                <div class="flex flex-grow gap-2">
                    <Stat
                        :option="{ title: 'Active', value: deviceStore.filterActiveDevices().length.toString(), isLoading: deviceStore.isGettingDevices }">
                    </Stat>
                    <Stat :option="{ title: 'Offline', value: '1' }"></Stat>
                </div>
                <div class="flex gap-2">
                    <Stat
                        :option="{ title: 'Total Consumption', value: `${totalBill}`, isLoading: deviceStore.isGettingDevices, hasError: billingStore.failed_TotalBilling }">
                    </Stat>
                    <Stat :option="{ title: 'Highest Consumption', value: 'Open' }"></Stat>
                </div>
                <div class="flex gap-2">
                    <Stat
                        :option="{ title: 'Peak Usage', value: `${totalConsumption.toFixed(2)}k L`, isLoading: deviceStore.isGettingDevices, hasError: deviceStore.failed_AllTotalConsumption }">
                    </Stat>
                </div>

            </div>
            <div class="w-full bg-blue-50 rounded-xl p-5 flex flex-col justify-between">
                <div class="w-40 mx-auto ">
                    <img class="w-full h-full object-cover" src="/img/lorawan.png" />
                </div>

                <div>
                    <p class="text-sm text-gray-500">Installed</p>
                    <h1 class="font-bold text-xl flex items-center gap-2"><span v-if="deviceStore.isGettingDevices">
                            <Loader2 class="animate-spin"></Loader2>
                        </span><span v-else>{{ deviceStore.devices.length ?? 0 }}</span> Devices</h1>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useUserStore } from '~/stores/auth/user/user.store';
import { useDeviceStore } from '~/stores/device/device.store';
import { Loader2 } from 'lucide-vue-next'
import { useBillStore } from '~/stores/bill/bill.store';
import { type IDevice } from '~/stores/device/model/device.model';

const data = [
    { name: 'Jan', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'Feb', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'Mar', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'Apr', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'May', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'Jun', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'Jul', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
]


const deviceStore = useDeviceStore();
const userStore = useUserStore();
const billingStore = useBillStore();

// Load the devices from the organisation
useAsyncData<IDevice[]>('devices', () => deviceStore.getDevicesByOrg(), { lazy: true })



// onBeforeMount(() => {
//     deviceStore.getDevicesByOrg()
//     billingStore.getTotalBilling()
// })

const totalConsumption = computed(() => deviceStore.sumTotalConsumptionFromDevices())
const totalBill = computed(() => billingStore.calculateTotalBill({ consumption: totalConsumption.value }).toFixed(2))

const props = defineProps<{ title?: string }>()

</script>