<template>
    <section class="py-12 bg-white sm:py-16 lg:py-20">
        <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div class="max-w-sm mx-auto">
                <div class="text-center">
                    <img class="w-36 mx-auto" src="/logo.png" alt="" />
                    <h1 class="mt-12 text-3xl font-bold text-gray-900">Enter Reset Code</h1>
                    <p class="mt-4 text-sm font-medium text-gray-500">Enter the reset code sent to your email address.</p>
                </div>

                <div class="space-y-4 mt-8">
                    <div>
                        <label for="code" class="text-sm font-bold text-gray-900">Reset Code</label>
                        <div class="mt-2">
                            <Input type="text" id="code" placeholder="Enter reset code" v-model="code"
                                class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600" />
                        </div>
                    </div>

                    <div>
                        <Button @click="verifyCode" :disabled="!code || authStore.isVerifyingResetCode || authStore.success_VerifyResetCode"
                            class="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-500">
                            <Loader2 v-if="authStore.isVerifyingResetCode" class="ml-2 animate-spin" :size="16"></Loader2>
                            <span v-else>Verify Code</span>
                        </Button>
                    </div>

                    <div class="mt-6 text-center">
                        <NuxtLink to="/auth/forgot-password" class="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                            Back to Reset Password
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { toast } from '@/components/ui/toast';
import { useAuthStore } from '~/stores/auth/auth.store';
import { Loader2 } from 'lucide-vue-next'

useHead({
    title: 'Enter Reset Code'
})

const code = ref("")
const router = useRouter()
const authStore = useAuthStore()

const verifyCode = async () => {
    if (!code.value) {
        toast({
            title: 'Error',
            description: 'Please enter the reset code',
        });
        return;
    }

    try {
        // Get email from auth store
        const email = authStore.resetPasswordEmail;
        if (!email) {
            toast({
                title: 'Error',
                description: 'Please start from the forgot password page.',
            });
            router.push('/auth/forgot-password');
            return;
        }

        await authStore.verifyResetCode({ email, code: code.value });

        if (authStore.success_VerifyResetCode) {
            toast({
                title: 'Success',
                description: 'Code verified successfully',
            });
            router.push('/auth/reset-password/new');
        }
    } catch (error) {
        // Error handling is done in the store
        toast({
            title: 'Error',
            description: authStore.verifyResetCodeFailure.message,
        });
    }
}
</script>