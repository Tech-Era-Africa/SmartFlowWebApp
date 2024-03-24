<template>
    <div class="w-full min-h-[100px] bg-[#E5FFE4] rounded-xl p-5 flex flex-col gap-2">
        <div class="flex  justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">Total Payable Bill</h1>
                <p class="text-muted-foreground text-xs my-2">Period: {{useFormatDateHuman(new Date(option.startDate ?? Date.now()))}} - {{useFormatDateHuman(new Date(option.endDate ?? Date.now()))}}</p>
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
        <Dialog :open="isModalOpen" @update:open="handleModalOpen">
            <DialogTrigger >
                <Button @click="generateBill" :disabled="totalCurrentCharge() == 0" class="w-full mt-5">Calculate Bill</Button>
            </DialogTrigger>
            <DialogContent class="sm:max-h-[95vh] overflow-y-auto">
                
                <div class="mt-4">
                    <BillPreview :option="option"></BillPreview>
                </div>
                
            </DialogContent>
        </Dialog>

    </div>
</template>
<script setup lang="ts">
import { useBillStore } from '~/stores/bill/bill.store';
import type { IBillOptionDTO } from '~/stores/bill/dto/billOption.dto';
import { useControlStore } from '~/stores/control/control.store';

const props = defineProps<{option : IBillOptionDTO}>()
const controlStore = useControlStore()
const billStore = useBillStore()

const formatAmount = (number: number) => new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS'
}).format(number)

const totalCurrentCharge = () => {


    const bill = props.option.totalConsumption ? billStore.calculateTotalBill(props.option.totalConsumption) : 0

    return bill
}

const generateBill = () => {
    controlStore.openModal('billModal')

    //  Get the current water consumption
    // deviceStore.getCurrentDeviceConsumption(props.option.device.objectId)
}

const isModalOpen = ref(false)
const handleModalOpen = (isOpen:boolean)=>{


    return props.option.totalConsumption > 0 ? isModalOpen.value = isOpen : isModalOpen.value = false
}
</script>