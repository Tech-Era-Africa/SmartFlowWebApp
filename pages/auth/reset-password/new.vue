<template>
    <section class="py-12 bg-white sm:py-16 lg:py-20">
        <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div class="max-w-sm mx-auto">
                <div class="text-center">
                    <img class="w-36 mx-auto" src="/logo.png" alt="" />
                    <h1 class="mt-12 text-3xl font-bold text-gray-900">Set New Password</h1>
                    <p class="mt-4 text-sm font-medium text-gray-500">Enter your new password below.</p>
                </div>

                <div class="space-y-4 mt-8">
                    <div>
                        <label for="password" class="text-sm font-bold text-gray-900">New Password</label>
                        <div class="mt-2 relative">
                            <Input :type="showPassword ? 'text' : 'password'" id="password" placeholder="Enter new password" v-model="password"
                                class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600" />
                            <button @click="showPassword = !showPassword" type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-500" />
                                <EyeOffIcon v-else class="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                        <!-- Password Strength Indicator -->
                        <div class="mt-2">
                            <div class="flex items-center space-x-1">
                                <div v-for="(level, index) in 4" :key="index"
                                    class="h-1 w-1/4 rounded transition-all duration-300"
                                    :class="{
                                        'bg-red-500': passwordStrength >= 1 && index <= 0 && password,
                                        'bg-orange-500': passwordStrength >= 2 && index <= 1 && password,
                                        'bg-yellow-500': passwordStrength >= 3 && index <= 2 && password,
                                        'bg-green-500': passwordStrength >= 4 && index <= 3 && password,
                                        'bg-gray-200': passwordStrength < index + 1 || !password
                                    }"></div>
                            </div>
                            <p class="mt-1 text-sm" :class="{
                                'text-red-500': passwordStrength === 1 && password,
                                'text-orange-500': passwordStrength === 2 && password,
                                'text-yellow-500': passwordStrength === 3 && password,
                                'text-green-500': passwordStrength === 4 && password,
                                'text-gray-500': !password
                            }">
                                {{ passwordStrengthText }}
                            </p>
                        </div>
                    </div>

                    <div>
                        <label for="confirmPassword" class="text-sm font-bold text-gray-900">Confirm Password</label>
                        <div class="mt-2 relative">
                            <Input :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" placeholder="Confirm new password" v-model="confirmPassword"
                                class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600" />
                            <button @click="showConfirmPassword = !showConfirmPassword" type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5 text-gray-500" />
                                <EyeOffIcon v-else class="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                        <!-- Password Match Indicator -->
                        <p v-if="confirmPassword" class="mt-1 text-sm" :class="{
                            'text-green-500': password && password === confirmPassword,
                            'text-red-500': password && password !== confirmPassword
                        }">
                            {{ password === confirmPassword ? 'Passwords match' : 'Passwords do not match' }}
                        </p>
                    </div>

                    <div>
                        <Button @click="updatePassword" :disabled="!isValidForm || authStore.isUpdatingPassword"
                            class="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-500">
                            <Loader2 v-if="authStore.isUpdatingPassword" class="mr-2 animate-spin" :size="16" />
                            <span>{{ authStore.isUpdatingPassword ? 'Updating Password...' : 'Update Password' }}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { toast } from '@/components/ui/toast';
import { useAuthStore } from '~/stores/auth/auth.store';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-vue-next';

useHead({
    title: 'Set New Password'
})

const authStore = useAuthStore()
const password = ref("")
const confirmPassword = ref("")
const router = useRouter()
 
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Password strength computation
const passwordStrength = computed(() => {
    if (!password.value) return 0;
    
    let strength = 0;
    const hasLowerCase = /[a-z]/.test(password.value);
    const hasUpperCase = /[A-Z]/.test(password.value);
    const hasNumbers = /\d/.test(password.value);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password.value);
    const isLongEnough = password.value.length >= 8;

    if (hasLowerCase) strength++;
    if (hasUpperCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChars && isLongEnough) strength++;

    return strength;
})

const passwordStrengthText = computed(() => {
    if (!password.value) return 'Password strength';
    
    switch (passwordStrength.value) {
        case 1: return 'Weak - Add uppercase letters, numbers, and special characters';
        case 2: return 'Fair - Add numbers and special characters';
        case 3: return 'Good - Add special characters';
        case 4: return 'Strong password!';
        default: return 'Very weak - Use at least 8 characters';
    }
})

const isValidForm = computed(() => {
    return password.value && 
           confirmPassword.value && 
           password.value === confirmPassword.value && 
           passwordStrength.value >= 3; // Require at least a "Good" password
})

const updatePassword = async () => {
    if (!password.value || !confirmPassword.value) {
        toast({
            title: 'Error',
            description: 'Please fill in all fields',
        });
        return;
    }

    if (password.value !== confirmPassword.value) {
        toast({
            title: 'Error',
            description: 'Passwords do not match',
        });
        return;
    }

    if (passwordStrength.value < 3) {
        toast({
            title: 'Error',
            description: 'Please choose a stronger password',
        });
        return;
    }

    const email = authStore.resetPasswordEmail;
    if (!email) {
        toast({
            title: 'Error',
            description: 'No email found for password reset',
        });
        return;
    }

    await authStore.updatePassword({
        email,
        password: password.value
    });

    if (!authStore.failed_UpdatePassword) {
        toast({
            title: 'Success',
            description: 'Your password has been updated successfully',
        });
        router.push('/auth/login');
    }
}
</script>