<template>
  <div class="bubble-wrapper" :class="chat.role">
    <div class="message-bubble" :class="chat.role">
      <p>{{ formatMessage }}</p>
    </div>
    <div @click="translate" class="translate-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path :fill="translateBg"
          d="M5.4 12.575q.65 0 1.113-.287t.462-.863t-.462-.875t-1.113-.3t-1.112.3t-.463.875t.463.863t1.112.287M1.875 8.8V7.7h2.85V6.3h1.3v1.4H8.9v1.1zM5.4 13.675q-1.175 0-2.013-.587t-.837-1.663q0-1.1.838-1.675T5.4 9.175q1.2 0 2.038.575t.837 1.675t-.837 1.675t-2.038.575M3.575 17.7v-3.5H4.9v2.4h6.6v1.1zM9.7 15.075V6.3h1.275v3.75H12.7v1.1H11v3.925zm7.85.575q.7 0 1.363-.325t1.212-.925v-2.65q-.575.075-1.062.175t-.913.225q-1.125.35-1.687.875T15.9 14.25q0 .65.45 1.025t1.2.375m-.575 1.7q-1.425 0-2.25-.812t-.825-2.213q0-1.3.825-2.125t2.65-1.325q.575-.15 1.263-.275t1.487-.225q-.05-1.175-.55-1.713t-1.55-.537q-.65 0-1.287.238T15.1 9.2l-.8-1.4q.825-.625 1.938-1.012T18.5 6.4q1.775 0 2.7 1.1t.925 3.2v6.425H20.45L20.3 16q-.7.625-1.537.988t-1.788.362" />
      </svg>
    </div>
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
    translateBg() {
      if (this.translated == true) {
        return '#808080';
      } else {
        return '#1040CA';
      }
    }
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
      width: 38px;
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
