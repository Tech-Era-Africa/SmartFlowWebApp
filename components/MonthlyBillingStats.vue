<template>
    <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-2">
       <div class="flex justify-between items-center">
           <div>
               <h1 class="font-bold text-lg">Monthly Bill</h1>
               <p class="text-xs text-gray-400">Updated 10mins ago</p>
           </div>
       </div>
       <div class="mt-5 flex flex-col flex-1 justify-between">
           <div class="flex justify-between items-center">
               <p class="text-gray-500 font-medium">Highest Bill</p>
               <p class="text-xl font-bold">GHC123</p>
           </div>
           <div class="flex justify-between items-center">
               <p class="text-gray-500 font-medium">Lowest Bill</p>
               <p class="text-xl font-bold">GHC23</p>
           </div>
           <div class="flex justify-between items-center">
               <p class="text-gray-500 font-medium">Highest Consumption</p>
               <div  class="badge badge-neutral">Device 1
                                                                </div>
           </div>
       </div>
    </div>
</template>