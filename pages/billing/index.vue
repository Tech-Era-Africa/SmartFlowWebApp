<template>
    <NuxtLayout  name="dashboard">
        <Header name="Water Billing"></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10  mx-8 left-0 right-0">
            <div class="w-full h-[50vh] flex  p-2 gap-4">
                <div class=" w-3/5 h-full">
                    <BillingChart></BillingChart>
                </div>
                <div class="flex flex-col gap-2 flex-1">
                   <MonthlyBillingStats></MonthlyBillingStats>
                   <div class="flex gap-2">
                    <Stat :option="{ title: 'Total Payable Bill', value: 'GHC570', clearBg : true }">
                    </Stat>
                    <Stat :option="{ title: 'Amount Paid', value: 'GHC570', clearBg : true }">
                        <div class="w-full mt-5 text-right">
                            <button class="btn btn-sm btn-outline flex gap-2 items-center">Redeem <Icon name="material-symbols:arrow-forward-rounded"></Icon></button>
                        </div>
                        
                    </Stat>
                </div>
                </div>

            </div>
            <div class="w-full flex  p-2 gap-4">
                <div class="h-full w-full">
                    <BillingTable :option="usersDataTableOption"></BillingTable>
                </div>
              

            </div>
            <div class="h-20">

            </div>
        </section>
    </NuxtLayout>
</template>
<script setup lang="ts">
import { UserModel, type User } from '~/stores/auth/user/model/user.model';
import {type UserTableOptionDTO} from '~/utils/dto/userTable.option.dto';

definePageMeta({ middleware: 'auth' })
useHead({title : "Water Billing"})

const usersDataTableOption = ref<UserTableOptionDTO>({
    title: 'Billing History',
            users : [
                new UserModel( {firstName : "Ronald", lastName : "Nettey", email : "ronaldnettey360@gmail.com", objectId : "1", phoneNumber : "+233558474469", role : "Admin", orgId : "Org A"}).user
            ] as User[],
            columns: ["Invoice #", "User", "Date Issued", "Date Paid", "Devices", "Status"]
} as UserTableOptionDTO);



</script>~/stores/auth/user/model/user.model