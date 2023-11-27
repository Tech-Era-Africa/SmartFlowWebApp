<template>
    <div class="flex justify-between items-center">
        <div class="flex flex-col gap-2">
            <h3 class="font-bold text-2xl">Water Bill <span class="text-gray-500 text-xs"> ID - {{ 'qJ8GY3LJE' }}</span></h3>
            <div class="flex gap-2">
                <div class="badge badge-default">Status</div>
                <div class="badge badge-default">Domestic</div>
            </div>
        </div>

        <div>
            <p class="text-xs text-right">Month</p>
            <h3 class="font-bold text-gray-600">{{ useFormatDateHuman(new Date(Date.now())) }}</h3>
        </div>

    </div>

    <div class="w-full bg-blue-50 rounded-xl p-5 flex flex-col justify-between">
        <div class="w-40 mx-auto ">
            <img class="w-full h-full object-cover" src="/img/lorawan.png" />
        </div>

        <div class="flex justify-between items-center">
            <div>
                <p class="text-sm text-gray-500">Name</p>
                <h1 class="font-bold text-xl">{{ option.device.name }}</h1>
            </div>
            <div>
                <p class="text-sm text-gray-500">Total Consumption</p>
                <h1 class="font-bold text-xl text-right"><span v-if="deviceStore.isGettingDeviceConsumption"
                        class="loading loading-spinner loading-xs text-gray-400"></span><span>{{ deviceStore.consumption
                        }}L</span>
                </h1>
            </div>
        </div>

    </div>
    <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center text-lg font-bold">
            <h1>Total Bill</h1>
            <h1>{{ useUseFormatCurrency(totalCurrentCharge) }}</h1>
        </div>
        <div class="flex justify-between items-center text-xs">
            <p>Bill Date</p>
            <p>{{ useFormatDateHuman(new Date(Date.now())) }}</p>
        </div>
        <div class="flex justify-between items-center text-xs">
            <p>Water Charge</p>
            <p>{{ useUseFormatCurrency(getBill().waterCharge) }}</p>
        </div>
        <div class="flex justify-between items-center text-xs">
            <p>1% Fire Fighting</p>
            <p>{{ useUseFormatCurrency(getBill().firefighting) }}</p>
        </div>
        <div class="flex justify-between items-center text-xs">
            <p>2% Rural Water</p>
            <p>{{ useUseFormatCurrency(getBill().ruralWater) }}</p>
        </div>
        <div class="flex justify-between items-center text-xs">
            <p>Service Charge</p>
            <p>{{ useUseFormatCurrency(getBill().serviceCharge) }}</p>
        </div>
        <div class="flex justify-between items-center text-xs">
            <p>Current Charges</p>
            <p>{{ useUseFormatCurrency(totalCurrentCharge) }}</p>
        </div>
        <div class="flex justify-between items-center text-xs">
            <p>Previous Balance</p>
            <p>GHC0</p>
        </div>

    </div>
    <div class="btn bg-green-600 text-white hover:bg-green-600 hover:text-white">Pay Bill <span
                        v-if="billStore.isCreatingBill" class="ml-2 loading loading-spinner"></span></div>
</template>
<script setup lang="ts">
import type { IDevice } from '~/server/api/device/model/device.model';
import { useBillStore } from '~/stores/bill/bill.store';
import { useControlStore } from '~/stores/control/control.store';
import { useDeviceStore } from '~/stores/device/device.store';

const props = defineProps({
    option: {
        type: Object as () => { device: IDevice },
        required: true
    },
})

const deviceStore = useDeviceStore()
const billStore = useBillStore()
const controlStore = useControlStore()


const getBill = () => useWaterBillAlgo({ consumption: deviceStore.consumption })

const totalCurrentCharge = computed(() => billStore.calculateTotalBill(deviceStore.consumption))

const createBill = () => billStore.createNewBill({
    deviceIds: [deviceStore.selectedDevice.objectId],
    currency: 'GHC',
    amount: totalCurrentCharge.value,
    fireCharge: getBill().firefighting,
    ruralCharge: getBill().ruralWater,
    serviceCharge: getBill().serviceCharge,
    waterCharge: getBill().waterCharge
})



watch(billStore, (state) => {
    if (state.success_CreatingBill) {
        controlStore.toggleBillModal() //Closes it if opened
        return controlStore.toggleBillSuccessModal()

    }
    if (state.failed_CreatingBill) {
        return alert("Failed to create bill")
    }
})



</script>