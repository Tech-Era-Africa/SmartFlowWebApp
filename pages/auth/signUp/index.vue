<template>
    <section class="py-12 bg-white sm:py-16 lg:py-20">
        <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div class="max-w-md mx-auto">
                <div class="text-center">
                    <img class="w-36 mx-auto" src="/logo.png" alt="SmartFlow" />
                    <h1 class="mt-8 text-3xl font-bold text-gray-900">Create Your Account</h1>

                    <!-- Invitation Info -->
                    <div v-if="fromInvitation" class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p class="text-sm font-medium text-blue-800">
                            You've been invited to join <span class="font-bold">{{ organizationName }}</span>
                        </p>
                    </div>

                    <p v-else class="mt-4 text-sm font-medium text-gray-500">
                        Join SmartFlow to monitor your water consumption with ease.
                    </p>
                </div>

                <div class="mt-8">
                    <form @submit.prevent="handleSignup" class="space-y-6">
                        <!-- First Name -->
                        <FormField v-slot="{ componentField }" name="firstName">
                            <FormItem>
                                <FormLabel class="text-sm font-bold text-gray-900">First Name</FormLabel>
                                <FormControl>
                                    <Input
                                        v-bind="componentField"
                                        type="text"
                                        placeholder="Enter your first name"
                                        class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <!-- Last Name -->
                        <FormField v-slot="{ componentField }" name="lastName">
                            <FormItem>
                                <FormLabel class="text-sm font-bold text-gray-900">Last Name</FormLabel>
                                <FormControl>
                                    <Input
                                        v-bind="componentField"
                                        type="text"
                                        placeholder="Enter your last name"
                                        class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <!-- Email -->
                        <FormField v-slot="{ componentField }" name="email">
                            <FormItem>
                                <FormLabel class="text-sm font-bold text-gray-900">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        v-bind="componentField"
                                        type="email"
                                        placeholder="Enter your email address"
                                        :disabled="fromInvitation"
                                        class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                                    />
                                </FormControl>
                                <FormDescription v-if="fromInvitation" class="text-xs text-gray-500">
                                    Email address from invitation cannot be changed
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <!-- Password -->
                        <FormField v-slot="{ componentField }" name="password">
                            <FormItem>
                                <FormLabel class="text-sm font-bold text-gray-900">Password</FormLabel>
                                <FormControl>
                                    <div class="relative">
                                        <Input
                                            v-bind="componentField"
                                            :type="showPassword ? 'text' : 'password'"
                                            placeholder="Create a strong password"
                                            class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600 pr-10"
                                        />
                                        <button
                                            type="button"
                                            @click="showPassword = !showPassword"
                                            class="absolute inset-y-0 right-0 flex items-center pr-3"
                                        >
                                            <EyeIcon v-if="showPassword" class="h-5 w-5 text-gray-400" />
                                            <EyeOffIcon v-else class="h-5 w-5 text-gray-400" />
                                        </button>
                                    </div>
                                </FormControl>
                                <div class="mt-1">
                                    <div class="w-full bg-gray-200 rounded-full h-1.5">
                                        <div
                                            class="h-1.5 rounded-full transition-all duration-300"
                                            :class="passwordStrengthClass"
                                            :style="{ width: `${passwordStrength * 25}%` }"
                                        ></div>
                                    </div>
                                    <p class="mt-1 text-xs" :class="passwordStrengthTextClass">
                                        {{ passwordStrengthText }}
                                    </p>
                                </div>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <!-- Confirm Password -->
                        <FormField v-slot="{ componentField }" name="confirmPassword">
                            <FormItem>
                                <FormLabel class="text-sm font-bold text-gray-900">Confirm Password</FormLabel>
                                <FormControl>
                                    <div class="relative">
                                        <Input
                                            v-bind="componentField"
                                            :type="showConfirmPassword ? 'text' : 'password'"
                                            placeholder="Confirm your password"
                                            class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600 pr-10"
                                        />
                                        <button
                                            type="button"
                                            @click="showConfirmPassword = !showConfirmPassword"
                                            class="absolute inset-y-0 right-0 flex items-center pr-3"
                                        >
                                            <EyeIcon v-if="showConfirmPassword" class="h-5 w-5 text-gray-400" />
                                            <EyeOffIcon v-else class="h-5 w-5 text-gray-400" />
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <!-- Terms and Conditions -->
                        <div class="space-y-2">
                            <div class="flex items-start space-x-3">
                                <div class="flex h-5 items-center">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        v-model="termsAccepted"
                                        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                </div>
                                <div class="text-sm leading-6">
                                    <label for="terms" class="text-sm font-medium text-gray-700">
                                        I agree to the <a href="#" class="text-indigo-600 hover:text-indigo-800">Terms of Service</a> and <a href="#" class="text-indigo-600 hover:text-indigo-800">Privacy Policy</a>
                                    </label>
                                </div>
                            </div>
                            <div v-if="showTermsError" class="text-sm font-medium text-red-500 pl-7">
                                You must accept the terms and conditions
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <Button
                            type="submit"
                            :disabled="isSubmitting || isSigningUp || !isFormValid"
                            class="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-500"
                            :class="{'opacity-50 cursor-not-allowed': !termsAccepted}"
                        >
                            <Loader2 v-if="isSubmitting || isSigningUp" class="mr-2 h-4 w-4 animate-spin" />
                            <span>{{ fromInvitation ? 'Accept Invitation & Create Account' : 'Create Account' }}</span>
                        </Button>
                    </form>
                </div>

                <div class="mt-6 text-center">
                    <p class="text-sm font-medium text-gray-900">
                        Already have an account?
                        <NuxtLink to="/auth/login" class="font-bold text-indigo-600 hover:text-indigo-800">
                            Sign in
                        </NuxtLink>
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { toast } from '@/components/ui/toast';
import { useAuthStore } from '~/stores/auth/auth.store';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-vue-next';
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Page metadata
definePageMeta({
    middleware: "already-auth"
});

useHead({
    title: 'Create Account'
});

// Initialize auth store
const authStore = useAuthStore();

// Form state
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isSubmitting = ref(false);
const termsAccepted = ref(false);
const showTermsError = ref(false);

// Computed properties for auth state
const isSigningUp = computed(() => authStore.signupState === 'LOADING');

// Get invitation data from query parameters
const route = useRoute();
const router = useRouter();

const email = ref(route.query.email as string || '');
const organizationId = ref(route.query.organizationId as string || '');
const organizationName = ref(route.query.organizationName as string || '');
const roleId = ref(route.query.roleId as string || '');
const fromInvitation = ref(route.query.fromInvitation === 'true');

// Password strength calculation
const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;

    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return strength;
};

// Form validation schema
const formSchema = toTypedSchema(
    z.object({
        firstName: z.string().min(2, 'First name must be at least 2 characters'),
        lastName: z.string().min(2, 'Last name must be at least 2 characters'),
        email: z.string().email('Please enter a valid email address'),
        password: z.string()
            .min(8, 'Password must be at least 8 characters')
            .refine(
                (password) => calculatePasswordStrength(password) >= 3,
                'Password is not strong enough'
            ),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        // Removed terms validation from schema since we're handling it separately
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })
);

// Initialize form
const { handleSubmit, values, meta } = useForm({
    validationSchema: formSchema,
    initialValues: {
        firstName: '',
        lastName: '',
        email: email.value,
        password: '',
        confirmPassword: '',
    }
});

// Computed properties for password strength
const passwordStrength = computed(() => calculatePasswordStrength(values.password || ''));

const passwordStrengthClass = computed(() => {
    switch (passwordStrength.value) {
        case 1: return 'bg-red-500';
        case 2: return 'bg-yellow-500';
        case 3: return 'bg-blue-500';
        case 4: return 'bg-green-500';
        default: return 'bg-gray-300';
    }
});

const passwordStrengthText = computed(() => {
    switch (passwordStrength.value) {
        case 1: return 'Weak - Add uppercase letters, numbers, and special characters';
        case 2: return 'Fair - Add numbers and special characters';
        case 3: return 'Good - Add special characters';
        case 4: return 'Strong password!';
        default: return 'Password strength';
    }
});

const passwordStrengthTextClass = computed(() => {
    switch (passwordStrength.value) {
        case 1: return 'text-red-500';
        case 2: return 'text-yellow-600';
        case 3: return 'text-blue-500';
        case 4: return 'text-green-500';
        default: return 'text-gray-500';
    }
});

const isFormValid = computed(() => {
    return meta.value.valid && termsAccepted.value;
});

// Form submission handler
const handleSignup = handleSubmit(async (formValues) => {
    // Check if terms are accepted
    if (!termsAccepted.value) {
        showTermsError.value = true;
        return;
    }

    // Hide terms error if previously shown
    showTermsError.value = false;

    try {
        isSubmitting.value = true;

        // Prepare signup data according to API requirements
        const signupData = {
            user: {
                org: {
                    id: fromInvitation.value ? organizationId.value : ""
                },
                role: {
                    id: fromInvitation.value ? roleId.value : ""
                },
                first_name: formValues.firstName,
                last_name: formValues.lastName,
                email: formValues.email
            },
            password: formValues.password
        };

        // Call the signup API
        await authStore.signUp(signupData);

        // Show success message
        toast({
            title: 'Account created successfully!',
            description: fromInvitation.value
                ? `You've joined ${organizationName.value}`
                : 'Welcome to SmartFlow',
        });

        // Redirect to login page after a short delay
        setTimeout(() => {
            router.push('/auth/login');
        }, 1500);

    } catch (error: any) {
        // Show error message
        toast({
            title: 'Registration failed',
            description: error.message || 'Something went wrong. Please try again.',
            variant: 'destructive'
        });
    } finally {
        // Only set local submitting state to false
        // The store's state will be handled by the store itself
        isSubmitting.value = false;
    }
});

// Watch terms acceptance to hide error when checked
watch(termsAccepted, (newValue) => {
    if (newValue) {
        showTermsError.value = false;
    }
});

// Ensure email is pre-filled and disabled if coming from invitation
onMounted(() => {
    if (fromInvitation.value && !email.value) {
        // If we have fromInvitation=true but no email, something is wrong
        toast({
            title: 'Invalid invitation',
            description: 'The invitation link appears to be invalid or incomplete.',
            variant: 'destructive'
        });
        router.push('/auth/login');
    }

    // Set terms to accepted by default for better UX
    termsAccepted.value = true;
});
</script>