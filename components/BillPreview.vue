<template>
    <div class="flex justify-between items-center">
        <div>
            <h3 class="font-bold text-2xl">{{ option.billTitle }}</h3>
            <!-- <div class="badge badge-accent">Preview</div>
            <p class="text-sm text-gray-400">#223dssd</p> -->
        </div>

        <div>
            <p class="text-xs text-right">Period</p>
            <h3 class="text-muted-foreground font-bold text-xs">{{ useFormatDateHuman(new Date(option.startDate)) }} -
                {{ useFormatDateHuman(new Date(option.endDate)) }}</h3>
        </div>

    </div>

    <div class="flex flex-col gap-2 mt-5">
        <div class="flex justify-between text-xs items-center">
            <p>Bill Type</p>
            <Badge class="border-dashed rounded-sm border-primary text-primary" variant="outline">{{ billTypeTitle }}
            </Badge>
        </div>
        <div class="flex justify-between items-center text-xs">
            <p>Bill Date</p>
            <p>{{ useFormatDateHuman(new Date(Date.now())) }}</p>
        </div>
        <div class="flex justify-between items-center text-xs">
            <p>Consumption</p>
            <p>{{ validStatNumber(option.totalConsumption).toFixed(2) }}k L</p>
        </div>
        <div class="flex justify-between items-center text-xs">
            <p>Water Charge</p>
            <p>{{ useUseFormatCurrency(getBill.waterCharge) }}</p>
        </div>
        <div class="flex justify-between items-center text-xs">
            <p>1% Fire Fighting</p>
            <p>{{ useUseFormatCurrency(getBill.firefighting) }}</p>
        </div>
        <div class="flex justify-between items-center text-xs">
            <p>2% Rural Water</p>
            <p>{{ useUseFormatCurrency(getBill.ruralWater) }}</p>
        </div>
        <div class="flex justify-between items-center text-xs">
            <p>Service Charge</p>
            <p>{{ useUseFormatCurrency(getBill.serviceCharge) }}</p>
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

    <Collapsible v-model:open="isOpen" class="my-5">
        <div class="rounded-md border border-blue-100 px-4 py-3 flex justify-between items-center w-full bg-blue-50">
            <p class="font-bold">Devices <Badge variant="outline">{{ option.devices.length }}</Badge>
            </p>
            <CollapsibleTrigger as-child>
                <Button variant="ghost" size="sm" class="w-9 p-0">
                    <ChevronsUpDown class="h-4 w-4" />
                </Button>
            </CollapsibleTrigger>
        </div>
        <CollapsibleContent class="space-y-2">
            <div class="grid grid-cols-3 my-5 gap-4">
                <DeviceCard v-for="device in option.devices" :option="{ device: device }"></DeviceCard>
            </div>
        </CollapsibleContent>
    </Collapsible>

    <Collapsible v-model:open="isBillsOpen" class="my-5">
        <div class="rounded-md border border-blue-100 px-4 py-3 flex justify-between items-center w-full bg-blue-50">
            <p class="font-bold">Billing History</p>
            <CollapsibleTrigger as-child>
                <Button variant="ghost" size="sm" class="w-9 p-0">
                    <ChevronsUpDown class="h-4 w-4" />
                </Button>
            </CollapsibleTrigger>
        </div>
        <CollapsibleContent class="space-y-2">
            <BillingTable :option="usersDataTableOption"></BillingTable>
        </CollapsibleContent>
    </Collapsible>

    <Button class="mt-4 w-full" @click="createBill" :disabled="billStore.isCreatingBill"><span>Create Bill
            Invoice</span>
        <Loader2 v-if="billStore.isCreatingBill" class="animate-spin ml-2" :size="16"></Loader2>
    </Button>

</template>
<script setup lang="ts">
import { useBillStore } from '~/stores/bill/bill.store';
import type { IBillOptionDTO } from '~/stores/bill/dto/billOption.dto';
import { useControlStore } from '~/stores/control/control.store';
import { useDeviceStore } from '~/stores/device/device.store';
import { ChevronsUpDown, Loader2 } from 'lucide-vue-next'
import { BillType } from '~/utils/class/billType.class';
import type { UserTableOptionDTO } from '~/utils/dto/userTable.option.dto';
import { UserModel, type User } from '~/stores/auth/user/model/user.model';

const props = defineProps<{ option: IBillOptionDTO }>()

const deviceStore = useDeviceStore()
const billStore = useBillStore()
const controlStore = useControlStore()
const credit = ref(0)
const totalBill = ref(0)
const isOpen = ref(false)
const isBillsOpen = ref(false)



const getBill = computed(() => useWaterBillAlgo({ consumption: props.option.totalConsumption, type: props.option.billTypeId }))

const billTypeTitle = computed(() => BillType.getName(props.option.billTypeId))
const validStatNumber = (num: number) => num > 0 ? num : 0

const totalCurrentCharge = () => {
    const bill = billStore.calculateTotalBill({ consumption: props.option.totalConsumption, type: props.option.billTypeId })

    // const totalAmountPaid = billStore.paidBills.reduce((accumulator, currentValue: any) => {
    //     return accumulator + currentValue.amount;
    // }, 0)

    credit.value = 0
    totalBill.value = bill

    return bill
}

const createBill = async () => {
    await billStore.createNewBill({
        bill: {
            currency: 'GHC',
            amount: totalCurrentCharge(),
            fireCharge: getBill.value.firefighting,
            ruralCharge: getBill.value.ruralWater,
            serviceCharge: getBill.value.serviceCharge,
            waterCharge: getBill.value.waterCharge,
            objectId: "",
            status: "", //Handled in store
            billType: props.option.billTypeId,
            clusterId: props.option.clusterId,
            createdBy: "", //Handled in store
            orgId: "", //Handled in store

        },
        deviceIds: props.option.devices.map((device) => device.objectId),

    })


    if (billStore.success_CreatingBill) {
        // Navigate to bill invoice page
        useRouter().push(`/billing/invoice/${billStore.createdBill.objectId}`)
        return;
    }

    if (billStore.failed_CreatingBill) {
        return alert("Failed to create bill invoice")
    }
}

const usersDataTableOption = ref<UserTableOptionDTO>({

    users: [
        new UserModel({ firstName: "Ronald", lastName: "Nettey", email: "ronaldnettey360@gmail.com", objectId: "1", phoneNumber: "+233558474469", role: "Admin" }).user
    ] as User[],
    columns: ["Invoice #", "User", "Date Issued", "Date Paid", "Devices", "Status"]
} as UserTableOptionDTO);



</script>