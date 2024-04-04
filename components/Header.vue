<template>
    <section class="h-1/3 bg-cover bg-center bg-no-repeat bg-blue-50 ">
        <header>
            <div class="flex justify-between h-16 px-8">
                <div class="flex items-center ">
                    <h1 class="text-black text-2xl">{{ name }}</h1>
                </div>

                <div class="flex items-center justify-end">
                    <UserNav></UserNav>
                </div>
            </div>
        </header>

    </section>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/auth/user/user.store';

const props = defineProps({
    name: {
        type: String,
        required: true
    }
})

const userStore = useUserStore()

</script>