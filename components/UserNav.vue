<script setup lang="ts">
import { useUserStore } from '~/stores/auth/user/user.store';
import { User, LogOut, LifeBuoy, Settings, CreditCard  } from 'lucide-vue-next'

const userStore = useUserStore()
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child class="flex gap-2 cursor-pointer">
            <div class="flex items-center sm:ml-5">
                <Avatar size="sm">
                    <AvatarImage :src="userStore.currentUser?.avatarUrl!" alt="user avatar" />
                    <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <div>
                    <h1>{{ userStore.currentUser?.firstName }} {{ userStore.currentUser?.lastName }}</h1>
                    <p class="text-xs text-muted-foreground">Super Admin</p>
                </div>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-60 mr-5 mt-2 rounded-2xl border-none p-4">
            <DropdownMenuLabel>
                <h2>My Account</h2>
                <div class="flex justify-between items-center">
                    <h2 class="text-muted-foreground text-xs font-normal">Plan</h2>
                    <Badge>Basic</Badge>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem class="cursor-pointer">
                    <User class="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem class="cursor-pointer">
                    <CreditCard class="mr-2 h-4 w-4" />
                    <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem class="cursor-pointer">
                    <Settings class="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="cursor-pointer">
                <LifeBuoy class="mr-2 h-4 w-4" />
                <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="cursor-pointer">
                <LogOut class="mr-2 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>