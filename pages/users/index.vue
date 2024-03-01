<template>
    <NuxtLayout  name="dashboard">
        <Header name="Device Users"></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10  mx-8 left-0 right-0">
            <div class="w-full flex  p-2 gap-4">
                <UsersTable :option="usersDataTableOption"></UsersTable>
            </div>
       
        </section>
    </NuxtLayout>
</template>
<script setup lang="ts">
import {type UserTableOptionDTO} from '~/utils/dto/userTable.option.dto';
import { UserModel } from '~/server/api/auth/user/model/user.model';

useHead({title : "Users"})
definePageMeta({ middleware: 'auth' })

const usersDataTableOption = ref<UserTableOptionDTO>({
    title: 'Users',
            users : [
                new UserModel( {firstName : "Ronald", lastName : "Nettey", email : "ronaldnettey360@gmail.com", objectId : "1", phoneNumber : "+233558474469", role : "Admin"})
            ] as UserModel[],
            columns: ["Id", "Name", "Email", "Phone Number", "Role", "Devices"]
} as UserTableOptionDTO);


</script>~/server/api/auth/user/model/user.model