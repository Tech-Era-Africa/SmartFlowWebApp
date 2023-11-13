<template>
    <NuxtLayout  name="dashboard">
        <Header></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10  mx-8 left-0 right-0">
            <div class="w-full flex  p-2 gap-4">
                <div class=" w-3/5 h-full">
                    <DeviceMonitoring></DeviceMonitoring>
                </div>
                <div class="flex flex-col gap-2 flex-1 flex-grow">
                   <MonthlyConsumptionStats></MonthlyConsumptionStats>
                   <div class="flex gap-2">
                    <Stat :option="{ title: 'Total Payable Bill', value: 'GHC570', clearBg : true }">
                    </Stat>
                </div>
                </div>

            </div>
            <div class="w-full h-96 flex bg-blue-50 p-2 gap-4">
                <div class="bg-gray-100 w-3/5 h-full">
                    <p>Water Consumed</p>
                </div>
                <div class="bg-gray-100 flex-1 h-full">
                    <DevicesSummary></DevicesSummary>
                </div>

            </div>
            <div class="h-20">

            </div>
        </section>
    </NuxtLayout>
</template>