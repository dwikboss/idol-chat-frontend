<template>
  <div class="bubble-wrapper" :class="chat.role">
    <div class="message-bubble" :class="chat.role">
      <p>{{ formatMessage }}</p>
    </div>
    <div @click="translate" class="translate-btn">A</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChatMessage',
  data() {
    return {
      translated: false as boolean,
    };
  },
  props: {
    chat: {
      type: Object as () => any,
      required: true,
    },
  },
  computed: {
    formatMessage() {
      if (this.chat.role === 'assistant') {
        return this.translated ? this.chat.content.English : this.chat.content.Korean;
      } else {
        return this.chat.content;
      }
    },
  },
  methods: {
    translate() {
      this.translated = !this.translated;
    },
  },
});
</script>

<style lang="scss" scoped>
.bubble-wrapper {
  display: flex;
  align-items: center;

  &.user {
    .translate-btn {
      display: none;
    }
  }

  &.assistant {
    .translate-btn {
      background-color: rgba(93, 144, 221, 0.582);
      color: white;
      font-family: 'Roboto';
      font-weight: 600;
      margin-left: 10px;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 8px;
      height: 30px;
      width: 30px;
      border-radius: 50%;
    }
  }

  .message-bubble {
    padding: 10px;
    color: white;
    font-family: 'Roboto';
    max-width: 65%;

    &.user {
      background-color: rgb(179, 34, 123);
      border-radius: 10px 10px 0 10px;
      margin-left: auto;
      max-width: 75%;
    }

    &.assistant {
      background-color: #bf81a4;
      border-radius: 10px 10px 10px 0px;
    }
  }
}
</style>
