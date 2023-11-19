<template>
    <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="pt-4 pb-12 bg-white sm:py-16 lg:pb-20 lg:pt-4">
            <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-4">
                <div class="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-xl font-bold text-gray-900" v-if="option?.title">{{ option?.title }}</p>
                        <p class="mt-1 text-sm font-medium text-gray-500" v-if="option?.subtitle">{{ option?.subtitle }}</p>
                    </div>

                </div>

                <div v-if="option.isLoading" class="w-full h-20 flex justify-center items-center">
                    <span class="loading loading-ball"></span>
                    <span class="loading loading-ball"></span>
                    <span class="loading loading-ball"></span>
                </div>

                <template v-else-if="option.users.length > 0">
                    <div class="flex flex-col mt-4 lg:mt-8">
                        <div class=" mx-auto w-full">
                            <div class="flex flex-col mt-4">
                                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                        <div class="overflow-hidden ring-1 ring-black ring-opacity-5 md:rounded-xl">
                                            <table class="min-w-full bg-white lg:divide-y lg:divide-gray-200">
                                                <thead class="hidden lg:table-header-group">
                                                    <tr>
                                                        <th class="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-widest"
                                                            v-for="item in option.columns">{{ item }}</th>


                                                    </tr>
                                                </thead>

                                                <tbody class="divide-y divide-gray-200">
                                                    <tr class="bg-white" v-for="person in option.users">
                                                        <td
                                                            class="hidden px-4 py-4 text-sm font-medium text-gray-900 lg:table-cell whitespace-nowrap">
                                                            <div class="flex items-center">

                                                                {{ person.objectId }}
                                                            </div>
                                                        </td>
                                                        <td
                                                            class="px-4 py-4 text-sm font-bold text-gray-900 align-top lg:align-middle whitespace-nowrap">
                                                            <div class="flex items-center">
                                                                <img class="flex-shrink-0 object-cover w-8 h-8 mr-3 rounded-full"
                                                                    :src="person.avatarUrl" alt="" />
                                                                {{ `${person.firstName} ${person.middleName ?? ''}
                                                                                                                                ${person.lastName}` }}
                                                            </div>
                                                            <div class="mt-1 space-y-2 font-medium pl-11 lg:hidden">
                                                                <div class="flex items-center">
                                                                    <svg class="w-4 h-4 mr-2 text-gray-400"
                                                                        xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                        viewBox="0 0 24 24" stroke="currentColor"
                                                                        stroke-width="2">
                                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                    </svg>
                                                                    {{ person.email }}
                                                                </div>

                                                                <div class="flex items-center">
                                                                    <svg class="w-4 h-4 mr-2 text-gray-400"
                                                                        xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                        viewBox="0 0 24 24" stroke="currentColor"
                                                                        stroke-width="2">
                                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                    </svg>
                                                                    {{ person.phoneNumber }}
                                                                </div>

                                                                <div class="flex items-center">
                                                                    <svg class="w-4 h-4 mr-2 text-gray-400"
                                                                        xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                        viewBox="0 0 24 24" stroke="currentColor"
                                                                        stroke-width="2">
                                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                    {{ }}
                                                                </div>
                                                                <!-- 
                                                    <div class="flex items-center pt-3 space-x-4">
                                                        <button type="button"
                                                            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none hover:text-white hover:border-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                            Edit Details
                                                        </button>
        
                                                        <button type="button"
                                                            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                            <svg class="w-5 h-5 mr-2 -ml-1" xmlns="http://www.w3.org/2000/svg"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                                stroke-width="2">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                            Remove
                                                        </button>
                                                    </div> -->
                                                            </div>
                                                        </td>

                                                        <td>
                                                           
                                                        </td>

                                                        <td>
                                                            
                                                        </td>

                                                        <td
                                                            class="hidden px-4 py-4 text-sm font-medium text-gray-900 xl:table-cell whitespace-nowrap">
                                                            <div class="flex items-center">
                                                                <div v-for="i in 2" class="badge badge-neutral">Device 1
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="badge badge-warning">Pending
                                                                </div>
                                                        </td>



                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template v-else>
                    <div class="w-full h-20 flex justify-center items-center">
                        <p>No User Found</p>
                    </div>
                </template>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { UserTableOptionDTO } from '~/utils/dto/userTable.option.dto';


defineProps({
    option: {
        type: Object as () => UserTableOptionDTO,
        required: true
    },
})



</script>