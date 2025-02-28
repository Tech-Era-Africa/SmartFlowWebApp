<template>
    <section class="py-12 bg-white sm:py-16 lg:py-20">
        <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div class="max-w-sm mx-auto">
                <div class="text-center">
                    <img class="w-36 mx-auto" src="/logo.png" alt="" />
                    <h1 class="mt-12 text-3xl font-bold text-gray-900">Forgot Password</h1>
                    <p class="mt-4 text-sm font-medium text-gray-500">Enter your email address and we'll send you instructions to reset your password.</p>
                </div>

                <div class="space-y-4 mt-8">
                    <div>
                        <label for="email" class="text-sm font-bold text-gray-900">Email</label>
                        <div class="mt-2">
                            <Input type="email" id="email" placeholder="Email address" v-model="email"
                                class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600" />
                        </div>
                    </div>

                    <div>
                        <Button @click="resetPassword" :disabled="authStore.isResettingPassword || !email"
                            class="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-500">
                            <Loader2 v-if="authStore.isResettingPassword" class="ml-2 animate-spin" :size="16"></Loader2>
                            <span v-else>Send Reset Instructions</span>
                        </Button>
                    </div>

                    <div class="mt-6 text-center">
                        <NuxtLink to="/auth/login" class="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                            Back to Login
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
import { toast } from '@/components/ui/toast';
import { useAuthStore } from '~/stores/auth/auth.store';

useHead({
    title: 'Forgot Password'
})

const authStore = useAuthStore()
const email = ref("")
const router = useRouter()

const resetPassword = async () => {
    if (!email.value) {
        toast({
            title: 'Error',
            description: 'Please enter your email address',
        });
        return;
    }

    await authStore.resetPassword({ email: email.value })

    if (authStore.failed_ResetPassword) {
        toast({
            title: 'Reset Password Failed',
            description: authStore.resetPasswordFailure.message,
        });
        return;
    }

    toast({
        title: 'Success',
        description: 'Password reset instructions have been sent to your email',
    });

    // Navigate to code entry page after successful password reset request
    router.push('/auth/reset-password/code');
}
</script>