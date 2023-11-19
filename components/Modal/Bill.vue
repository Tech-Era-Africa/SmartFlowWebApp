<template>
    <dialog id="billModal" class="modal">
        <div class="modal-box flex flex-col gap-5">
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="font-bold text-2xl">Water Bill</h3>
                    <div class="badge badge-accent">Preview</div>
                    <!-- <p class="text-sm text-gray-400">#223dssd</p> -->
                </div>
           
<div>
    <p class="text-xs text-right">Month</p>
    <h3 class="font-bold text-gray-600">November 2023</h3>
</div>
                
            </div>

            <div class="w-full bg-blue-50 rounded-xl p-5 flex flex-col justify-between">
                <div class="w-40 mx-auto ">
                    <img class="w-full h-full object-cover" src="/img/lorawan.png" />
                </div>

                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-sm text-gray-500">Name</p>
                        <h1 class="font-bold text-xl">{{ 'Device name' }}</h1>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Total Consumption</p>
                        <h1 class="font-bold text-xl text-right">{{ '0' }}</h1>
                    </div>
                </div>

            </div>
            <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center text-lg font-bold">
                    <h1>Total Bill</h1>
                    <h1>GHC123.00</h1>
                </div>
                <div class="flex justify-between items-center mb-2">
                    <p>Bill Type</p>
                    <div class="dropdown dropdown-end dropdown-bottom">
                        <label tabindex="0" class="btn btn-outline">Domestic
                            <Icon name="ion:caret-down-outline" />
                        </label>
                        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a>Domestic</a></li>
                            <li><a>Commercial</a></li>
                            <li><a>Industrial</a></li>
                        </ul>
                    </div>
                </div>
                <div class="flex justify-between items-center text-xs">
                    <p>Bill Date</p>
                    <p>24th Dec 2023</p>
                </div>
                <div class="flex justify-between items-center text-xs">
                    <p>Water Charge</p>
                    <p>GHC120</p>
                </div>
                <div class="flex justify-between items-center text-xs">
                    <p>1% Fire Fighting</p>
                    <p>GHC120</p>
                </div>
                <div class="flex justify-between items-center text-xs">
                    <p>2% Rural Water</p>
                    <p>GHC120</p>
                </div>
                <div class="flex justify-between items-center text-xs">
                    <p>Service Charge</p>
                    <p>GHC0</p>
                </div>
                <div class="flex justify-between items-center text-xs">
                    <p>Current Charges</p>
                    <p>GHC0</p>
                </div>
                <div class="flex justify-between items-center text-xs">
                    <p>Previous Balance</p>
                    <p>GHC0</p>
                </div>
 
            </div>
            <div class="modal-action">
                <form method="dialog" class="flex gap-4">
                    <div class="btn bg-black text-white hover:bg-black hover:text-white">Create Invoice</div>
                    <button class="btn">Close</button>
                </form>
            </div>
        </div>
    </dialog>
</template>