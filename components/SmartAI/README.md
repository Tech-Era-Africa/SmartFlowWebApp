# SmartAI Chat Widget

A floating chat widget that provides AI assistance to users throughout the SmartFlow application.

## Features

- Floating chat button that appears on all pages
- Expandable chat interface with message history
- Persistent chat history using localStorage
- Unread message counter
- Typing indicators
- Responsive design for all screen sizes
- Global state management via composables
- Easy integration with any page or component

## Usage

### Basic Usage

The SmartAI widget is automatically included in the default layout, so it will appear on all pages that use this layout.

```vue
<template>
  <div>
    <!-- Your page content -->
  </div>
</template>
```

### Programmatic Interaction

You can interact with the SmartAI widget programmatically from any component using the `useSmartAI` composable:

```vue
<template>
  <div>
    <button @click="openChat">Open Chat</button>
    <button @click="sendMessage">Ask about water usage</button>
  </div>
</template>

<script setup>
import { useSmartAI } from '~/composables/useSmartAI'

const { isOpen, unreadMessages, openChat, closeChat, toggleChat, addMessage } = useSmartAI()

const sendMessage = () => {
  addMessage('What is my water usage this month?')
}
</script>
```

## API

### Composable: `useSmartAI`

#### State

- `isOpen`: Boolean indicating if the chat widget is open
- `unreadMessages`: Number of unread messages

#### Methods

- `openChat()`: Opens the chat widget
- `closeChat()`: Closes the chat widget
- `toggleChat()`: Toggles the chat widget open/closed
- `addMessage(message: string)`: Sends a message to the chat widget

## Customization

The SmartAI widget can be customized by modifying the `SmartAIWidget.vue` component. The component uses Tailwind CSS for styling, so you can easily adjust colors, sizes, and other visual aspects.

## Implementation Details

- The widget uses Vue 3's Teleport feature to render at the body level, ensuring it appears above all other content
- Chat history is stored in localStorage for persistence between page reloads
- The widget uses a global state via the composable to ensure consistent state across components
- Custom events are used for communication between components and the widget
