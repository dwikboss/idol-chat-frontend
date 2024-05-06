<template>
  <div :class="messageClass">
    <div class="message-wrapper">
      <!-- <p>{{ chat.message }}</p> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import type { Message } from '../interfaces/_IMessage';

export default defineComponent({
  name: 'ChatMessage',
  props: {
    // chat: {
    //   type: Object as () => Message,
    //   required: true,
    // },
  },
  computed: {
    messageClass(): string {
      return this.chat.user ? 'chat-message user' : 'chat-message assistant';
    },
  },
});
</script>
