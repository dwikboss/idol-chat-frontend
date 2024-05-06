<template>
  <div class="message-bubble" :class="chat.role">
    <p>{{ formatMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChatMessage',
  props: {
    chat: {
      type: Object as () => any,
      required: true,
    },
  },
  computed: {
    formatMessage() {
      if (this.chat.role == 'assistant') {
        return this.chat.content.Korean;
      } else {
        return this.chat.content
      }
    }
  },
});
</script>
<style lang="scss" scoped>
.message-bubble {
  background-color: rgb(179, 34, 123);
  padding: 10px;
  color: white;
  font-family: 'Roboto';
  

  &.user {
    border-radius: 10px 10px 0 10px;
    margin-left: auto;
    max-width: 75%;
  }
  &.assistant {
    border-radius: 10px 10px 10px 0px;
    max-width: 75%;
    margin-right: auto;
  }
}
</style>