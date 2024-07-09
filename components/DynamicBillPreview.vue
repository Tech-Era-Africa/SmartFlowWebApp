<template>
    <div role="alert" class="alert alert-error">
        <!-- <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> -->
        <span>Something went wrong!</span>
    </div>
    <div class="flex justify-between items-center">
        <div>
            <h3 class="font-bold text-2xl">Water Bill</h3>
            <div class="badge badge-accent">Preview</div>
            <!-- <p class="text-sm text-gray-400">#223dssd</p> -->
        </div>

        <div>
            <p class="text-xs text-right">Month</p>
            <h3 class="font-bold text-gray-600">{{ useFormatDateHuman(new Date(Date.now())) }}</h3>
        </div>

    </div>


    <div class="w-full  rounded-xl  flex flex-col justify-between">

        <div class="flex-1  flex-grow grid-cols-2 lg:grid-cols-3 grid gap-2">
            <div v-for="device in deviceStore.devices" class="relative">
                <input type="checkbox" :checked="true" class="checkbox absolute checkbox-sm right-2 top-2" />
                <DeviceCard :option="{ device, hideUpdateDate: true }"></DeviceCard>
            </div>

        </div>

    </div>

    <div class="flex flex-col gap-2">

        <div class="flex justify-between text-xs items-center">
            <p>Bill Type</p>
            <p>Domestic</p>
            <!-- <div class="dropdown dropdown-end dropdown-bottom">
                        <label tabindex="" class="btn btn-outline">Domestic
                            <Icon name="ion:caret-down-outline" />
                        </label>
                        <ul tabindex="" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a>Domestic</a></li>
                            <li><a>Commercial</a></li>
                            <li><a>Industrial</a></li>
                        </ul>
                    </div> -->
        </div>
        <div class="flex justify-between items-center text-xs">
            <p>Bill Date</p>
            <p>{{ useFormatDateHuman(new Date(Date.now())) }}</p>
        </div>
        <div class="flex justify-between items-center text-xs">
            <p>Consumption</p>
            <p>{{ useUseCubicToLitre(0) }}L</p>
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
            <p>{{ useUseFormatCurrency(totalBill) }}</p>
        </div>
        <div class="flex justify-between items-center text-xs" v-if="billStore.paidBills.length >= 1">
            <p>Credit</p>
            <p>{{ useUseFormatCurrency(credit) }}</p>
        </div>
        <div class="flex justify-between items-center text-xs">
            <p>Previous Balance</p>
            <p>GHC0</p>
        </div>
        <div class="flex justify-between items-center text-lg font-bold">
            <h1>Total Bill</h1>
            <h1>{{ useUseFormatCurrency(totalCurrentCharge()) }}</h1>
        </div>

    </div>
    <div>
        <span v-if="deviceStore.isGettingDeviceConsumption" class="loading loading-bars"></span>
        <template v-else>
            <Button disabled class="w-full bg-black text-white hover:bg-black hover:text-white" @click="createBill">Create
                Invoice <span v-if="billStore.isCreatingBill" class="ml-2 loading loading-spinner"></span></Button>
        </template>
    </div>
</template>
<script setup lang="ts">
import type { IDevice } from '~/server/api/device/model/device.model';
import { useBillStore } from '~/stores/bill/bill.store';
import { useControlStore } from '~/stores/control/control.store';
import { useDeviceStore } from '~/stores/device/device.store';

const props = defineProps()

const deviceStore = useDeviceStore()
const billStore = useBillStore()
const controlStore = useControlStore()
const credit = ref(0)
const totalBill = ref(0)

const getBill = () => useWaterBillAlgo({ consumption: deviceStore.consumption })

const totalCurrentCharge = () => {
    const bill = billStore.calculateTotalBill(deviceStore.consumption)

    const totalAmountPaid = billStore.paidBills.reduce((accumulator, currentValue: any) => {
        return accumulator + currentValue.amount;
    }, 0)

    credit.value = totalAmountPaid
    totalBill.value = bill

    return bill - totalAmountPaid
}

const createBill = () => billStore.createNewBill({
    bill: {
        currency: 'GHC',
        amount: totalCurrentCharge(),
        fireCharge: getBill().firefighting,
        ruralCharge: getBill().ruralWater,
        serviceCharge: getBill().serviceCharge,
        waterCharge: getBill().waterCharge,
        createdAt: "",
        objectId: "",
        status: {} as any,
        billType: {} as any,
        updatedAt: ""

    },
    devices: [deviceStore.selectedDevice],

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



</script>~/stores/device/model/device.model