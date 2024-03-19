<template>
    <div class="flex gap-2">
        <Stat
            :option="{ title: 'Smart Credits', value: `GHC ${billingStore.accountCredit - deviceStore.sumTotalUsageFromDevices()}`, clearBg: true, isLoading: billingStore.loading_AccountCredit || deviceStore.isGettingDevices, hasError: billingStore.failed_AccountCredit }">
            <div class="text-right">
                <Dialog>
                    <DialogTrigger>
                        <Button class="btn btn-sm btn-outline flex gap-2 items-center">Top Up <Icon
                                name="material-symbols:arrow-forward-rounded"></Icon></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Smart Credit Top Up</DialogTitle>
                            <DialogDescription>
                                Top up your smart credit account with packages below.
                            </DialogDescription>
                        </DialogHeader>
                        <div class="grid grid-cols-3 gap-5 my-5">
                            <Button v-for="option in packages" @click="selectPackage(option)" variant="outline" :class="{'border-green-600 border-solid border-s-4 bg-green-50' : values.amount == option.amount}"
                                class="font-bold text-2xl h-20  border-dashed  cursor-pointer">GHC{{
                option.amount }}</Button>
                        </div>
                        <form class="w-full space-y-6" @submit="onFormSubmit">
                            <FormField v-slot="{ componentField }" name="amount">
                                <FormItem>
                                    <FormControl>
                                        <FormLabel class="text-sm font-bold text-gray-900">
                                            Amount
                                        </FormLabel>
                                        <Input
                                            class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                                            type="number" placeholder="GHC50" v-bind="componentField"
                                            :disabled="deviceStore.isAddingNewDevice" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormField>

                            <Button type="submit" class="w-full">
                                <template v-if="deviceStore.isAddingNewDevice">
                                    <Loader2 class="animate-spin"></Loader2>
                                </template>
                                <span v-else>Top Up</span>
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>

            <template #bottom>
                <div class="mt-2">
                    <p class="text-muted-foreground text-xs">Usage: {{
                deviceStore.sumTotalUsageFromDevices().toFixed(2) }}</p>
                </div>
            </template>
        </Stat>
    </div>
</template>
<script setup lang="ts">
import { useBillStore } from '~/stores/bill/bill.store';
import { useDeviceStore } from '~/stores/device/device.store';
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-vue-next'

const deviceStore = useDeviceStore()
const billingStore = useBillStore()

onBeforeMount(() => {
    billingStore.getAccountCredit()
})

const packages = ref<{ amount: number, selected: boolean }[]>([
    {
        amount: 50,
        selected: false,
    },
    {
        amount: 250,
        selected: false,
    },
    {
        amount: 700,
        selected: false
    }
])

const selectPackage = (option: { amount: number, selected: boolean }) => {
    setFieldValue('amount', option.amount)
}


// FORM SETTINGS
const formSchema = toTypedSchema(z.object({
    amount: z.number().min(50, "Amount should be more than GHC50"),
}))

const { handleSubmit, values, setFieldValue } = useForm({
    validationSchema: formSchema,
})

const onFormSubmit = handleSubmit(async (values) => handleTopUpSubmission(values))
//  end of FORM SETTINGS

const handleTopUpSubmission = (values: { amount: number }) => {

}
</script>