<template>
  <Dialog :open="isOpen" @update:open="setIsOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Session Expired</DialogTitle>
        <DialogDescription>
          {{ message }}
        </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col gap-4 py-4">
        <p class="text-sm text-muted-foreground">
          Please log in again to continue using the application.
        </p>
      </div>
      <DialogFooter class="sm:justify-center">
        <Button type="button" @click="handleLogin" class="w-full">
          Log In
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  reason?: 'expired' | 'inactivity';
}>();

const isOpen = ref(false);
const message = ref('Your session has expired.');
const router = useRouter();

onMounted(() => {
  // Set appropriate message based on reason
  if (props.reason === 'inactivity') {
    message.value = 'Your session has expired due to inactivity.';
  } else if (props.reason === 'expired') {
    message.value = 'Your authentication session has expired.';
  }
  
  // Open the dialog
  isOpen.value = true;
});

const setIsOpen = (value: boolean) => {
  isOpen.value = value;
  
  // If dialog is closed, redirect to login
  if (!value) {
    handleLogin();
  }
};

const handleLogin = () => {
  // Clear the session expired flag
  if (process.client) {
    localStorage.removeItem('session_expired');
  }
  
  // Redirect to login page
  router.push('/auth/login');
};
</script>
