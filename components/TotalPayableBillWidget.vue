<template>
    <div class="w-full h-full bg-[#E5FFE4] rounded-xl p-5 flex flex-col gap-2">
        <div class="flex  justify-between items-center">
            <h1 class="font-bold text-lg">Total Payable Bill</h1>
            <div class="dropdown dropdown-end dropdown-bottom">
                <label tabindex="0" class="btn btn-ghost m-1">Domestic
                    <Icon name="ion:caret-down-outline" />
                </label>
                <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a>Domestic</a></li>
                    <li><a>Commercial</a></li>
                    <li><a>Industrial</a></li>
                </ul>
            </div>


        </div>
        <div class="flex-1 flex flex-col lg:flex-row gap-2">
            <Stat :option="{ title: 'Amount', value: `${formatAmount(option.amount)}`, clearBg: true }">
                <slot />
            </Stat>

        </div>
        <button @click="generateBill" :disabled="option.amount == 0" class="btn bg-black text-white  mt-5">Generate Bill</button>
    </div>
</template>
<script setup lang="ts">
const props = defineProps({
    option: {
        type: Object as () => { currency?: string, amount: number },
        required: true
    },
})

const formatAmount = (number: number) => new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: props.option.currency ?? 'GHS'
}).format(number)

const generateBill = ()=>{
    const billModal = document.getElementById("billModal");
     // Trigger  modal
     (billModal as any).showModal();
}
</script>