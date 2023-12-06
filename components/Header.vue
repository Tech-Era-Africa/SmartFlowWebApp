<template>
   <section class="h-1/3 bg-cover bg-center bg-no-repeat bg-blue-50 bg-headerBg">
    <header>
        <div class="flex justify-between h-16 px-8">
            <div class="flex items-center ">
               <h1 class="text-white text-2xl">{{ name }}</h1>
            </div>

            <div class="flex items-center justify-end">
            
                <div class="flex items-center space-x-6 sm:ml-5">
                  

                    <div class="relative">
                        <button type="button" class="p-1 text-gray-700 transition-all duration-200 bg-white rounded-full hover:text-gray-900 focus:outline-none hover:bg-gray-100">
                            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                        <!-- <span class="inline-flex items-center px-1.5 absolute -top-px -right-1 py-0.5 rounded-full text-xs font-semibold bg-indigo-600 text-white"> 6 </span> -->
                    </div>

                    <button type="button" class="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                        <img class="object-cover bg-gray-300 rounded-full w-9 h-9" :src="avatarUrl" alt="" />
                    </button>
                </div>
            </div>
        </div>
</header>

   </section>
</template>
<script setup lang="ts">
    const props = defineProps({
    name: {
        type: String,
        required: true
    }
})

const avatarUrl = ref("data:image/png;base64,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")
</script>