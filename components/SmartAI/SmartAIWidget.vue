<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <!-- Chat Window (expanded state) -->
      <Transition name="slide-fade">
        <div v-if="isOpen" class="mb-4 w-full sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col overflow-hidden">
          <!-- Header -->
          <div class="p-4 bg-blue-600 text-white flex justify-between items-center">
            <div class="flex items-center">
              <div class="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <BrainIcon class="h-5 w-5 text-white" />
              </div>
              <h3 class="font-medium">SmartAI Assistant</h3>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="minimizeChat" class="p-1 hover:bg-blue-700 rounded-full transition-colors">
                <MinusIcon class="h-5 w-5" />
              </button>
              <button @click="clearChat" class="p-1 hover:bg-blue-700 rounded-full transition-colors">
                <TrashIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Chat Messages -->
          <div ref="messagesContainer" class="flex-1 p-4 overflow-y-auto max-h-[400px] space-y-4">
            <template v-if="messages.length > 0">
              <div v-for="(message, index) in messages" :key="index" 
                   :class="[
                     'flex', 
                     message.sender === 'user' ? 'justify-end' : 'justify-start'
                   ]">
                <div :class="[
                      'max-w-[80%] p-3 rounded-lg',
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    ]">
                  <p class="text-sm">{{ message.text }}</p>
                  <span class="text-xs mt-1 block opacity-70">
                    {{ formatTime(message.timestamp) }}
                  </span>
                </div>
              </div>
            </template>
            <div v-else class="flex flex-col items-center justify-center h-32 text-center">
              <BrainIcon class="h-10 w-10 text-blue-200 mb-2" />
              <p class="text-gray-500 text-sm">Hi! I'm your SmartAI assistant.</p>
              <p class="text-gray-400 text-xs mt-1">Ask me anything about your water system.</p>
            </div>
            <div v-if="isTyping" class="flex justify-start">
              <div class="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[80%]">
                <div class="flex space-x-1">
                  <div class="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div class="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  <div class="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <div class="border-t border-gray-200 p-3">
            <form @submit.prevent="sendMessage" class="flex items-center space-x-2">
              <input
                v-model="newMessage"
                type="text"
                placeholder="Type your message..."
                class="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="isTyping"
              />
              <button
                type="submit"
                class="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!newMessage.trim() || isTyping"
              >
                <SendIcon class="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </Transition>

      <!-- Floating Button (collapsed state) -->
      <button
  @click="toggleChat"
  class="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-105"
  :class="{ 'rotate-45': isOpen }"
>
        <SparklesIcon v-if="!isOpen" class="h-6 w-6" />
        <SparklesIcon v-else class="h-6 w-6" />
      </button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { 
  MessageSquare as MessageSquareIcon, 
  X as XIcon, 
  Send as SendIcon,
  Brain as BrainIcon,
  Trash as TrashIcon,
  Minus as MinusIcon,
  Sparkles as SparklesIcon
} from 'lucide-vue-next';

// State
const isOpen = ref(false);
const newMessage = ref('');
const isTyping = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

// Message interface
interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const messages = ref<Message[]>([]);

// Toggle chat window
const toggleChat = () => {
  isOpen.value = !isOpen.value;
  
  // If opening the chat and no messages, show welcome message
  if (isOpen.value && messages.value.length === 0) {
    setTimeout(() => {
      addAIMessage("Hello! I'm your SmartAI assistant. How can I help you with your water management system today?");
    }, 500);
  }
};

// Minimize chat window
const minimizeChat = () => {
  isOpen.value = false;
};

// Clear chat history
const clearChat = () => {
  messages.value = [];
  setTimeout(() => {
    addAIMessage("I've cleared our conversation. How else can I assist you?");
  }, 300);
};

// Send a message
const sendMessage = async () => {
  if (!newMessage.value.trim() || isTyping.value) return;
  
  // Add user message
  const userMessage = newMessage.value.trim();
  messages.value.push({
    text: userMessage,
    sender: 'user',
    timestamp: new Date()
  });
  
  // Clear input
  newMessage.value = '';
  
  // Simulate AI typing
  isTyping.value = true;
  
  // Simulate AI response (replace with actual API call)
  setTimeout(() => {
    generateAIResponse(userMessage);
  }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
};

// Generate AI response based on user input
const generateAIResponse = (userMessage: string) => {
  let response = '';
  
  // Simple pattern matching for demo purposes
  const lowerCaseMessage = userMessage.toLowerCase();
  
  if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
    response = "Hello! How can I help you today?";
  } else if (lowerCaseMessage.includes('water usage') || lowerCaseMessage.includes('consumption')) {
    response = "Your water consumption this month is 15% lower than last month. Great job conserving water!";
  } else if (lowerCaseMessage.includes('leak') || lowerCaseMessage.includes('leakage')) {
    response = "I don't detect any leaks in your system currently. The last leak check was performed yesterday.";
  } else if (lowerCaseMessage.includes('bill') || lowerCaseMessage.includes('cost')) {
    response = "Your estimated water bill for this month is $45.20, which is $8.30 less than last month.";
  } else if (lowerCaseMessage.includes('save') || lowerCaseMessage.includes('saving')) {
    response = "To save more water, consider adjusting your irrigation schedule or installing low-flow fixtures. Would you like specific recommendations?";
  } else if (lowerCaseMessage.includes('thank')) {
    response = "You're welcome! Is there anything else I can help you with?";
  } else {
    response = "I'm not sure I understand. Could you rephrase your question about your water system?";
  }
  
  // Add AI message
  addAIMessage(response);
};

// Add AI message with typing indicator
const addAIMessage = (text: string) => {
  isTyping.value = false;
  
  messages.value.push({
    text,
    sender: 'ai',
    timestamp: new Date()
  });
};

// Format timestamp
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Scroll to bottom when new messages arrive
watch(() => messages.value.length, async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
});

// Save chat history to localStorage
watch(messages, (newMessages) => {
  localStorage.setItem('smartai-chat-history', JSON.stringify(newMessages));
}, { deep: true });

// Load chat history from localStorage
onMounted(() => {
  const savedMessages = localStorage.getItem('smartai-chat-history');
  if (savedMessages) {
    try {
      const parsedMessages = JSON.parse(savedMessages);
      // Convert string timestamps back to Date objects
      messages.value = parsedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (e) {
      console.error('Failed to parse saved messages', e);
    }
  }
});
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
