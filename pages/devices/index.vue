<template>
    <NuxtLayout name="dashboard">
        <Header name="Devices"></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10  mx-8 left-0 right-0">
            <div class="w-full flex  p-2 gap-4">
                <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col justify-between gap-2">
                    <div class="flex  justify-between items-center">
                        <h1 class="font-bold text-lg">Devices</h1>
                        <div class="flex items-center gap-4">
                            <form class="w-full">
                                <label for="default-search"
                                    class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                    </div>
                                    <input type="search" id="default-search"
                                        class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500   dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Search Device Id, Name..." required>

                                </div>
                            </form>

                            <button type="button"
                                class="items-center hidden px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm sm:inline-flex hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                <svg class="w-4 h-4 mr-1 -ml-1" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Add New Device
                            </button>
                        </div>

                    </div>
                    <div class="flex-1 flex-grow flex gap-2">
                        <DeviceCard v-for="i in 3"></DeviceCard>
                    </div>


                    <div class="text-center mt-10">
                        <div class="join">
                            <button class="join-item btn btn-sm">1</button>
                            <button class="join-item btn btn-sm btn-active">2</button>
                            <button class="join-item btn btn-sm">3</button>
                            <button class="join-item btn btn-sm">4</button>
                        </div>

                    </div>
                </div>
            </div>

        </section>
    </NuxtLayout>
</template>
<script setup>
useHead({ title: "Devices" })

</script>