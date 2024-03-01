<template>
    <NuxtLayout name="dashboard">
        <Header name="Device Users"></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10  mx-8 left-0 right-0">

                <div class="pt-4 pb-12 bg-white sm:py-16 lg:pb-20 lg:pt-4 w-full rounded-xl">
                    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-4">
                        <h1>Users</h1>
                        <DataTable :columns="userColumns" :data="users" :is-loading="userStore.isLoading"
                            @get-table-data="handleDataTableData" @get-row-data="handleRowClicked"></DataTable>
                    </div>
                </div>



        </section>
    </NuxtLayout>
</template>
<script setup lang="ts">
import type { Row, Table } from '@tanstack/vue-table';
import type { User } from '~/server/api/auth/user/model/user.model';
import { userColumns } from '~/stores/auth/user/columns/user.column';
import { useUserStore } from '~/stores/auth/user/user.store';


useHead({ title: "Users" })
definePageMeta({ middleware: 'auth' })

const userStore = useUserStore()
const users = ([] as User[])
users.push(userStore.currentUser!)

const handleDataTableData = (data: Table<User>) => {

}

const handleRowClicked = (row: Row<User>) => {
    alert(`Selected user: ${row.original.objectId}`)
}


</script>