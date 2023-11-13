<template>
    <NuxtLayout  name="dashboard">
        <Header></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10  mx-8 left-0 right-0">
            <div class="w-full h-96 flex bg-blue-50 p-2 gap-4">
                <div class="bg-gray-100 w-3/5 h-full">
                    <p>Device Monitoring</p>
                </div>
                <div class="bg-gray-100 flex-1 h-full">
                    <p>Monthly Consumption</p>
                </div>

            </div>
            <div class="w-full h-96 flex bg-blue-50 p-2 gap-4">
                <div class="bg-gray-100 w-3/5 h-full">
                    <p>Water Consumed</p>
                </div>
                <div class="bg-gray-100 flex-1 h-full">
                    <p>Devices</p>
                </div>

            </div>
            <div class="h-20">

            </div>
        </section>
    </NuxtLayout>
</template>