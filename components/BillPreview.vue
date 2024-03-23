<template>
    <div class="flex justify-between items-center">
        <div>
            <h3 class="font-bold text-2xl">{{ option.billTitle }}</h3>
            <!-- <div class="badge badge-accent">Preview</div>
            <p class="text-sm text-gray-400">#223dssd</p> -->
        </div>

        <div>
            <p class="text-xs text-right">Period</p>
            <h3 class="text-muted-foreground font-bold text-xs">{{useFormatDateHuman(new Date(option.startDate))}} - {{useFormatDateHuman(new Date(option.endDate))}}</h3>
        </div>

    </div>

    <div class="w-full bg-blue-50 rounded-xl p-5 my-5 flex flex-col justify-between">
        <div class="w-40 mx-auto ">
            <img class="w-full h-full object-cover" src="/img/lorawan.png" />
        </div>

        <div class="flex justify-between items-center">
            <div>
                <p class="text-sm text-gray-500">Name</p>
                <h1 class="font-bold text-xl">{{ 'Device Name' }}</h1>
            </div>
            <div>
                <p class="text-sm text-gray-500">Total Consumption</p>
                <h1 class="font-bold text-xl text-right">{{option.totalConsumption}}k L
                </h1>
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
            <p>{{ option.totalConsumption }}k L</p>
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
        <!-- <div class="flex justify-between items-center text-xs">
            <p>Previous Balance</p>
            <p>GHC0</p>
        </div> -->
        <div class="flex justify-between items-center text-lg font-bold mt-4">
            <h1>Total Bill</h1>
            <h1>{{ useUseFormatCurrency(totalCurrentCharge()) }}</h1>
        </div>

    </div>
   
</template>
<script setup lang="ts">
import { useBillStore } from '~/stores/bill/bill.store';
import type { IBillOptionDTO } from '~/stores/bill/dto/billOption.dto';
import { useControlStore } from '~/stores/control/control.store';
import { useDeviceStore } from '~/stores/device/device.store';

const props = defineProps<{option: IBillOptionDTO}>()

const deviceStore = useDeviceStore()
const billStore = useBillStore()
const controlStore = useControlStore()
const credit = ref(0)
const totalBill = ref(0)

const getBill = () => useWaterBillAlgo({ consumption: props.option.totalConsumption })

const totalCurrentCharge = () => {
    const bill = billStore.calculateTotalBill(props.option.totalConsumption)

    // const totalAmountPaid = billStore.paidBills.reduce((accumulator, currentValue: any) => {
    //     return accumulator + currentValue.amount;
    // }, 0)

    credit.value = 0
    totalBill.value = bill

    return bill
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



</script>