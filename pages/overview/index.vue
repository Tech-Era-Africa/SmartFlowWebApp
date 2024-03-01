<template>
    <NuxtLayout  name="dashboard">
        <Header name="Overview" ></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10 mx-2  lg:mx-8 left-0 right-0">
            <div class="w-full flex flex-col lg:flex-row  p-2 gap-4">
                <div class="w-full  lg:w-3/5 h-full">
                    <DeviceMonitoring></DeviceMonitoring>
                </div>
                <div class="flex flex-col gap-2 flex-1 flex-grow">
                   <MonthlyConsumptionStats :option="monthlyConsumptionStatOption"></MonthlyConsumptionStats>
                   <div class="flex gap-2">
                    <Stat :option="{ title: 'Total Payable Bill', value: 'GHC570', clearBg : true }">
                        <div class="text-right">
                            <button class="btn btn-sm btn-outline flex gap-2 items-center">Send Bill <Icon name="material-symbols:arrow-forward-rounded"></Icon></button>
                        </div>
                    </Stat>
                </div>
                </div>

            </div>
            <div class="w-full h-96 flex flex-col lg:flex-row   p-2 gap-4">
                <div class="w-full lg:w-3/5 h-full">
                    <WaterConsumptionChart :option="consumptionChart"></WaterConsumptionChart>
                </div>
                <div class="flex-1 h-full">
                    <DevicesSummary></DevicesSummary>
                </div>

            </div>
            <div class="h-20">

            </div>
        </section>
        <!-- <Drawer drawerId = "deviceDrawer">
           <SingleDeviceMonitoring></SingleDeviceMonitoring>
           <WaterConsumptionChart></WaterConsumptionChart>
           <MonthlyConsumptionStats></MonthlyConsumptionStats>
           <TotalPayableBillWidget></TotalPayableBillWidget>
           <UsersTable :option="usersDataTableOption"></UsersTable>

        </Drawer> -->
    </NuxtLayout>
</template>

<script setup lang="ts">
import { UserModel, type User } from '~/server/api/auth/user/model/user.model';
import type { UserTableOptionDTO } from '~/utils/dto/userTable.option.dto';
import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';

useHead({title : "Overview"})
definePageMeta({ middleware: 'auth' })

const usersDataTableOption = ref<UserTableOptionDTO>({
    title: 'Users',
            users : [
                new UserModel( {firstName : "Ronald", lastName : "Nettey", email : "ronaldnettey360@gmail.com", objectId : "1", phoneNumber : "+233558474469", role : "Admin"}).user
            ] as User[],
            columns: ["Id", "Name", "Email", "Phone Number", "Role", "Devices"]
} as UserTableOptionDTO);

const monthlyConsumptionStatOption:{ deviceId:string, consumption:number } = {
    consumption: 4,
    deviceId : ""
}

const consumptionChart:IWaterConsumptionChart = {
    isLoading : false,
    series : [],
    success : true,
    xAxisCategories : []
}



</script>~/server/api/auth/user/model/user.model