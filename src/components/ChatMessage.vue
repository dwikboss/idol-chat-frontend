<template>
  <div class="bubble-wrapper" :class="chat.role">
    <div class="message-info" v-if="chat.role != 'user'" :class="chat.grouped_message ? 'transparent' : ''">
      <img :src="`/images/profile_pictures/${idol.profile_picture}`" alt="pfp" />
    </div>
    <div class="message-bubble" :class="chat.role" v-bind:class="audio">
      <p v-if="!chat.voice">{{ formatMessage }}</p>
      <audio v-if="chat.voice" controls :src="chat.voice"></audio>
      <img v-if="chat.media" :src="`/images/minji_pics/${chat.media}`" alt="pic_minji" />
    </div>
    <div v-if="!chat.voice" @click="translate" class="translate-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path
          :fill="translateBg"
          d="M5.4 12.575q.65 0 1.113-.287t.462-.863t-.462-.875t-1.113-.3t-1.112.3t-.463.875t.463.863t1.112.287M1.875 8.8V7.7h2.85V6.3h1.3v1.4H8.9v1.1zM5.4 13.675q-1.175 0-2.013-.587t-.837-1.663q0-1.1.838-1.675T5.4 9.175q1.2 0 2.038.575t.837 1.675t-.837 1.675t-2.038.575M3.575 17.7v-3.5H4.9v2.4h6.6v1.1zM9.7 15.075V6.3h1.275v3.75H12.7v1.1H11v3.925zm7.85.575q.7 0 1.363-.325t1.212-.925v-2.65q-.575.075-1.062.175t-.913.225q-1.125.35-1.687.875T15.9 14.25q0 .65.45 1.025t1.2.375m-.575 1.7q-1.425 0-2.25-.812t-.825-2.213q0-1.3.825-2.125t2.65-1.325q.575-.15 1.263-.275t1.487-.225q-.05-1.175-.55-1.713t-1.55-.537q-.65 0-1.287.238T15.1 9.2l-.8-1.4q.825-.625 1.938-1.012T18.5 6.4q1.775 0 2.7 1.1t.925 3.2v6.425H20.45L20.3 16q-.7.625-1.537.988t-1.788.362"
        />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type Idol from '@/interfaces/_IIdol';

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
    idol: {
      type: Object as () => Idol,
      required: true,
    },
  },
  computed: {
    audio() {
      return this.chat.voice ? 'audio' : '';
    },
    formatMessage() {
      if (this.chat.role === 'assistant') {
        return this.translated ? this.chat.content.English : this.chat.content.Korean;
      } else {
        return this.chat.content;
      }
    },
    translateBg() {
      if (this.translated == true) {
        return '#63ba00';
      } else {
        return '#808080';
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
.transparent {
  opacity: 0;
}

.message-info {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  align-self: flex-start;

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid black;
  }
  &.user {
  }
}

.bubble-wrapper {
  display: flex;
  align-items: flex-end;

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
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 8px 8px 0 8px;
      height: 30px;
      width: 38px;
    }
  }

  .message-bubble {
    padding: 10px;
    color: white;
    font-family: 'Roboto';
    max-width: 65%;

    &.audio {
      max-width: 100%;
    }

    img {
      width: 100%;
      margin-top: 5px;
    }

    &.user {
      background: rgb(255, 255, 255);
      background: linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(88 154 255) 100%);
      color: black;
      border: 1px solid black;
      border-radius: 10px 10px 0 10px;
      margin-left: auto;
      max-width: 75%;
    }

    &.assistant {
      background: rgb(255, 255, 255);
      background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(125, 232, 6, 1) 100%);
      color: black;
      border: 1px solid black;
      border-radius: 0px 10px 10px 10px;
    }
  }
}

audio::-webkit-media-controls-panel {
  background-color: #ffffff;
}
</style>
