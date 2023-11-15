<template>
    <div class="hidden bg-white md:flex md:w-64 md:flex-col h-full">
        <div class="flex flex-col pt-5 overflow-y-auto h-full">
            <div class="flex items-center flex-shrink-0 px-4">
                <NuxtImg class="hidden w-auto h-8 lg:block" src="/logo.png" alt="" />
            </div>

            <div class="flex flex-col justify-between flex-1 mt-8">
                <div class="space-y-4 flex-grow-0">
                    <nav class="flex-1 space-y-2">
                        <NuxtLink to="/overview" title="" :class="{'bg-indigo-50 text-blue-600  mx-5 rounded-lg' : isActive('/overview')}" class="flex items-center px-4 py-3 text-sm font-medium transition-all duration-200  group">
                            <svg class="flex-shrink-0 w-5 h-5 mr-4" xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Overview
                        </NuxtLink>

                        <NuxtLink to="/devices" title="" :class="{'bg-indigo-50 text-blue-600 mx-5 rounded-lg' : isActive('/devices')}" class="flex items-center px-4 py-3 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-200 group">
                            <Icon name="material-symbols-light:device-hub-rounded" size="24" class="mr-5"></Icon>
                            Devices
                        </NuxtLink>

                        <NuxtLink to="/users" title="" :class="{'bg-indigo-50 text-blue-600  mx-5 rounded-lg' : isActive('/users')}" class="flex items-center px-4 py-3 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-200 group">
                            <Icon name="fluent:people-12-regular" size="20" class="mr-5"></Icon>
                            Users
                        </NuxtLink>

                        <NuxtLink to="/billing" :class="{'bg-indigo-50 text-blue-600  mx-5 rounded-lg' : isActive('/billing')}" title="" class="flex items-center px-4 py-3 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-200 group">
                            <Icon name="streamline:money-cash-coins-stack-accounting-billing-payment-stack-cash-coins-currency-money-finance" size="15" class="mr-5"></Icon>
                            Billing
                    
                        </NuxtLink>
                    </nav>
                </div>
                <div class="px-5 pb-8 mt-16">
                    <div class="flex items-center space-x-6">
                        <a href="#" title="" class="text-xs font-medium text-gray-500 hover:text-gray-900"> Privacy Policy </a>
                        <a href="#" title="" class="text-xs font-medium text-gray-500 hover:text-gray-900"> Terms of Service </a>
                    </div>
                    <p class="mt-4 text-xs font-medium text-gray-500">© 2022 Rareblocks</p>
                </div>
            </div>
        </div>
    </div>

</template>
<script setup lang="ts">
console.log(useRoute().path)
const isActive = (path:string)=> useRoute().path.startsWith(path)
</script>