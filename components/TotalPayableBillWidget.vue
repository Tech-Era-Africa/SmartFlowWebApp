<template>
    <div class="w-full h-full bg-[#E5FFE4] rounded-xl p-5 flex flex-col gap-2">
        <div class="flex  justify-between items-center">
            <h1 class="font-bold text-lg">Total Payable Bill</h1>
            <!-- <button class="btn">
                Device A
                <Icon name="ion:caret-down-outline" />
            </button> -->
        </div>
        <div class="flex-1 flex flex-col lg:flex-row gap-2">
            <Stat :option="{ title: 'Month', value: 'GHC570', clearBg : true }">
            <p>Rise</p>
        </Stat>
        
        </div>
        <button class="btn bg-black text-white  mt-5">Send Bill</button>
    </div>
</template>