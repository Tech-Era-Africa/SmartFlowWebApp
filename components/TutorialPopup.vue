<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <!-- Close button -->
          <button 
            @click="closePopup" 
            class="absolute top-3 right-3 z-10 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close tutorial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700 dark:text-gray-300">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h2 class="text-2xl font-bold">Welcome to SmartFlow</h2>
            <p class="mt-2 text-blue-100">Learn how to make the most of your water management system</p>
          </div>

          <!-- Video container -->
          <div class="aspect-video bg-gray-900 w-full">
            <video 
              ref="videoRef"
              class="w-full h-full object-cover" 
              controls
              :src="videoUrl"
              poster="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            ></video>
          </div>

          <!-- Content -->
          <div class="p-6">
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Getting Started with SmartFlow</h3>
              <p class="text-gray-600 dark:text-gray-400">
                This quick tutorial will guide you through the main features of the SmartFlow platform, 
                helping you understand how to monitor and optimize your water usage efficiently.
              </p>
            </div>

            <!-- Progress indicator -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ currentStep }} of {{ totalSteps }}</span>
                <div class="ml-3 bg-gray-200 dark:bg-gray-700 h-1 w-32 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-blue-600 rounded-full" 
                    :style="`width: ${(currentStep / totalSteps) * 100}%`"
                  ></div>
                </div>
              </div>
              
              <!-- Do not show again checkbox -->
              <label class="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="doNotShowAgain" 
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                >
                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Don't show again</span>
              </label>
            </div>

            <!-- Action buttons -->
            <div class="flex justify-between">
              <button 
                @click="skipTutorial" 
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Skip tutorial
              </button>
              <div class="flex space-x-2">
                <button 
                  v-if="currentStep > 1"
                  @click="previousStep" 
                  class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Previous
                </button>
                <button 
                  v-if="currentStep < totalSteps"
                  @click="nextStep" 
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Next
                </button>
                <button 
                  v-else
                  @click="finishTutorial" 
                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                >
                  Finish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>

const props = defineProps({
  autoShow: {
    type: Boolean,
    default: true
  },
  tutorialSteps: {
    type: Array,
    default: () => [
      {
        title: 'Welcome to SmartFlow',
        description: 'Learn how to monitor and optimize your water usage',
        videoUrl: 'https://example.com/videos/intro.mp4'
      }
    ]
  }
});

const emit = defineEmits(['close']);

// State
const isVisible = ref(false);
const doNotShowAgain = ref(false);
const currentStep = ref(1);
const totalSteps = ref(props.tutorialSteps.length);
const videoRef = ref(null);
const videoUrl = ref(props.tutorialSteps[0]?.videoUrl || '');

// Check localStorage on mount
onMounted(() => {
  const hasSeenTutorial = localStorage.getItem('smartflow_tutorial_seen') === 'true';
  
  if (props.autoShow && !hasSeenTutorial) {
    isVisible.value = true;
  }
});

// Watch for changes to doNotShowAgain
watch(doNotShowAgain, (newValue) => {
  if (newValue) {
    localStorage.setItem('smartflow_tutorial_seen', 'true');
  }
});

// Methods
const closePopup = () => {
  isVisible.value = false;
  emit('close');
};

const skipTutorial = () => {
  if (doNotShowAgain.value) {
    localStorage.setItem('smartflow_tutorial_seen', 'true');
  }
  closePopup();
};

const nextStep = () => {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++;
    updateVideoSource();
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    updateVideoSource();
  }
};

const finishTutorial = () => {
  localStorage.setItem('smartflow_tutorial_seen', 'true');
  closePopup();
};

const updateVideoSource = () => {
  // Update video source based on current step
  const stepIndex = currentStep.value - 1;
  if (props.tutorialSteps[stepIndex]?.videoUrl) {
    videoUrl.value = props.tutorialSteps[stepIndex].videoUrl;
    
    // Reset video if there's a video element
    if (videoRef.value) {
      videoRef.value.load();
    }
  }
};

// Public methods
defineExpose({
  show: () => {
    isVisible.value = true;
  },
  hide: closePopup
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
