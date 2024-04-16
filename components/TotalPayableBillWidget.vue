<template>
    <div class="w-full min-h-[100px] bg-[#E5FFE4] rounded-xl p-5 flex flex-col gap-2">
        <div class="flex flex-col items-start">
            <div>
                <h1 class="font-bold text-lg">Total Payable Bill</h1>
            </div>

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
        <Select @update:model-value="handleSelectChange">

            <SelectTrigger as-child class="flex gap-2 cursor-pointer">
                <Badge variant="outline" class="px-4 py-2 border-none">
                    <span>{{ billTypeTitle }}</span>
                    <ChevronDown class="h-4 w-4" />
                </Badge>
            </SelectTrigger>
            <SelectContent class="mr-5 mt-2 rounded-2xl border-none p-2">
                <SelectGroup class="space-y-2">
                    <SelectLabel>
                        <h2>Bill Type</h2>
                    </SelectLabel>
                    <SelectSeparator />
                    <SelectItem :value="BillType.getId('DOMESTIC')!"
                        :class="{ 'bg-green-200': option.billTypeId == BillType.getId('DOMESTIC') }">
                        <div class="flex justify-between w-full ">
                            <div class="flex items-center">
                                <Home class="mr-2 h-4 w-4" />
                                <span>Domestic</span>
                            </div>

                        </div>
                    </SelectItem>
                    <SelectItem :value="BillType.getId('COMMERCIAL')!"
                        :class="{ 'bg-green-200': option.billTypeId == BillType.getId('COMMERCIAL') }">
                        <div class="flex justify-between w-full ">
                            <div class="flex items-center">
                                <Building2 class="mr-2 h-4 w-4" />
                                <span>Commercial</span>
                            </div>

                        </div>
                    </SelectItem>
                    <SelectItem :value="BillType.getId('INDUSTRIAL')!"
                        :class="{ 'bg-green-200': option.billTypeId == BillType.getId('INDUSTRIAL') }">
                        <div class="flex justify-between w-full flex-row">
                            <div class="flex items-center">
                                <Factory class="mr-2 h-4 w-4" />
                                <span>Industrial</span>
                            </div>
                        </div>
                    </SelectItem>
                </SelectGroup>

            </SelectContent>
        </Select>
        <Dialog :open="isModalOpen" @update:open="handleModalOpen">
            <DialogTrigger>
                <Button :disabled="totalCurrentCharge() == 0" class="w-full mt-5">Calculate
                    Bill</Button>
            </DialogTrigger>
            <DialogContent class="sm:max-h-[95vh] sm:max-w-[45vw] overflow-y-auto">

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
import { BillType } from '~/utils/class/billType.class';

const props = defineProps<{ option: IBillOptionDTO }>()

const billStore = useBillStore()

const formatAmount = (number: number) => new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS'
}).format(number)





const billTypeTitle = computed(() => BillType.getName(props.option.billTypeId)) //Default to commercial
const handleSelectChange = (item: string) => {
    props.option.billTypeId = item
}

const totalCurrentCharge = () => {
    const bill = props.option.totalConsumption ? billStore.calculateTotalBill({ consumption: props.option.totalConsumption, type: props.option.billTypeId }) : 0
    return bill
}

const isModalOpen = ref(false)
const handleModalOpen = (isOpen: boolean) => {

    return props.option.totalConsumption > 0 ? isModalOpen.value = isOpen : isModalOpen.value = false
}
</script>
