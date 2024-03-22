<template>
    <div class="w-full min-h-[100px] bg-[#E5FFE4] rounded-xl p-5 flex flex-col gap-2">
        <div class="flex  justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">Total Payable Bill</h1>
                <!-- <p class="text-xs text-gray-400">Last Updated: 10mins ago</p> -->
            </div>
            <div class="dropdown dropdown-end dropdown-bottom">
                <label tabindex="0" class="btn btn-ghost m-1">
                    <!-- <Icon name="ion:caret-down-outline" /> -->
                </label>
                <!-- <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a>This Month</a></li>
                    <li><a>This Year</a></li>
                </ul> -->
            </div>


        </div>
        <div class="flex-1 flex flex-col lg:flex-row gap-2">
            <Stat :option="{ title: 'Amount', value: `${formatAmount(totalCurrentCharge())}`, clearBg: true }">
                <slot />
            </Stat>

        </div>
        <Button @click="generateBill" :disabled="totalCurrentCharge() == 0" class=" mt-5">Generate Bill</Button>
    </div>
</template>
<script setup lang="ts">
import { useBillStore } from '~/stores/bill/bill.store';
import { useControlStore } from '~/stores/control/control.store';
import { useDeviceStore } from '~/stores/device/device.store';
import type { IDevice } from '~/stores/device/model/device.model';

const props = defineProps({
    option: {
        type: Object as () => { currency?: string, consumption:number, device:IDevice },
        required: true
    },
})

const deviceStore = useDeviceStore()
const controlStore = useControlStore()
const billStore = useBillStore()

const formatAmount = (number: number) => new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: props.option.currency ?? 'GHS'
}).format(number)

const totalCurrentCharge = ()=>{
   const bill = billStore.calculateTotalBill(props.option.consumption)

   const totalAmountPaid = billStore.paidBills.reduce((accumulator, currentValue:any) => {
  return accumulator + currentValue.amount;
}, 0)

   return bill - totalAmountPaid
}

const generateBill = ()=>{
    controlStore.openModal('billModal')

    //  Get the current water consumption
    deviceStore.getCurrentDeviceConsumption(props.option.device.objectId)
}
</script>~/stores/device/model/device.model