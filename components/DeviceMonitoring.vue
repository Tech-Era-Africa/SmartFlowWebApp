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
                <div class="flex gap-2">
                    <Stat :option="{ title: 'Active', value: '0' }"></Stat>
                    <Stat :option="{ title: 'Users', value: '1' }"></Stat>
                </div>
                <div class="flex gap-2">
                    <Stat :option="{ title: 'Total Bill', value: billingStore.totalBilling.toString(), isLoading:billingStore.isLoading_TotalBilling }"></Stat>
                    <!-- <Stat :option="{ title: 'Valve', value: 'Open' }"></Stat> -->
                </div>
                <div class="flex gap-2">
                    <Stat :option="{ title: 'Total Consumption', value: `${deviceStore.allTotalConsumption}L`, isLoading : deviceStore.loading_AllTotalConsumption }">
                    </Stat>
                </div>

            </div>
            <div class="w-full bg-blue-50 rounded-xl p-5 flex flex-col justify-between">
                <div class="w-40 mx-auto ">
                    <img class="w-full h-full object-cover" src="/img/lorawan.png"/>
                </div>

                <div>
                    <p class="text-sm text-gray-500">Installed</p>
                    <h1 class="font-bold text-xl flex items-center gap-2"><span v-if="deviceStore.isGettingDevices"><Loader2 class="animate-spin"></Loader2></span><span v-else>{{ deviceStore.devices.length ?? 0 }}</span> Devices</h1>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useUserStore } from '~/stores/auth/user/user.store';
import { useDeviceStore } from '~/stores/device/device.store';
import { Loader2 } from 'lucide-vue-next'
import { usePaymentStore } from '~/stores/payment/payment.store';


const deviceStore = useDeviceStore();
const userStore = useUserStore();
const billingStore = usePaymentStore();

onBeforeMount(() => {
    deviceStore.getDevicesByUser(userStore.currentUser!.objectId);
    billingStore.getTotalBilling()
})

const props = defineProps<{title?:string}>()

</script>