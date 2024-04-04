<template>
    <div class="w-full min-h-[100px] bg-[#E5FFE4] rounded-xl p-5 flex flex-col gap-2">
        <div class="flex  justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">Total Payable Bill</h1>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger as-child class="flex gap-2 cursor-pointer">
                    <Badge variant="outline" class="px-4 py-2 border-black border-dashed">
                        <span>Commercial</span>
                        <ChevronDown class="h-4 w-4" />
                    </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-60 mr-5 mt-2 rounded-2xl border-none p-4">
                    <DropdownMenuLabel>
                        <h2>Bill Type</h2>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="flex justify-between"
                        :class="{ 'bg-green-200': option.billTypeId == 'dom' }">
                        <div class="flex items-center">
                            <Home class="mr-2 h-4 w-4" />
                            <span>Domestic</span>
                        </div>

                        <CircleCheckBig v-if="option.billTypeId == 'dom'" class="h-4 w-4" />
                    </DropdownMenuItem>
                    <DropdownMenuItem class="flex justify-between"
                        :class="{ 'bg-green-200': option.billTypeId == 'rxc51QYu7l' }">
                        <div class="flex items-center">
                            <Building2 class="mr-2 h-4 w-4" />
                            <span>Commercial</span>
                        </div>

                        <CircleCheckBig class="h-4 w-4" v-if="option.billTypeId == 'rxc51QYu7l'" />

                    </DropdownMenuItem>
                    <DropdownMenuItem class="flex justify-between"
                        :class="{ 'bg-green-200': option.billTypeId == 'ind' }">
                        <div class="flex items-center">
                            <Factory class="mr-2 h-4 w-4" />
                            <span>Industrial</span>
                        </div>

                        <CircleCheckBig class="h-4 w-4" v-if="option.billTypeId == 'ind'" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div class="flex gap-1 items-center text-muted-foreground">
            <CalendarDays class="h-4 w-4 " />
            <p class=" text-xs my-2">{{ useFormatDateHuman(new Date(option.startDate ??
                            Date.now())) }} - {{ useFormatDateHuman(new Date(option.endDate ?? Date.now())) }}</p>
        </div>
        <div class="flex-1 flex flex-col lg:flex-row gap-2">
            <Stat :option="{ title: 'Amount', value: `${formatAmount(totalCurrentCharge())}`, clearBg: true }">
                <slot />
            </Stat>

        </div>
        <Dialog :open="isModalOpen" @update:open="handleModalOpen">
            <DialogTrigger>
                <Button @click="generateBill" :disabled="totalCurrentCharge() == 0" class="w-full mt-5">Calculate
                    Bill</Button>
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
import { Building2, CalendarDays, ChevronDown, CircleCheckBig, Factory, Home } from 'lucide-vue-next';
import { useBillStore } from '~/stores/bill/bill.store';
import type { IBillOptionDTO } from '~/stores/bill/dto/billOption.dto';

const props = defineProps<{ option: IBillOptionDTO }>()
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
    // controlStore.openModal('billModal')

    //  Get the current water consumption
    // deviceStore.getCurrentDeviceConsumption(props.option.device.objectId)
}

const isModalOpen = ref(false)
const handleModalOpen = (isOpen: boolean) => {


    return props.option.totalConsumption > 0 ? isModalOpen.value = isOpen : isModalOpen.value = false
}
</script>