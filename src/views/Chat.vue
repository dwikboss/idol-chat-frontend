<template>
  <div class="page chat">
    <div class="overview-header">
      <div class="full-width">
        <img :src="`/images/profile_pictures/${idolData.profile_picture}`" alt="Profile Picture" />
        <div class="chat-header-text">
          <h4>{{ idolData.display_name }}</h4>
          <p>Online</p>
        </div>
      </div>
    </div>
    <div class="chat-container full-width">
        <ChatMessage v-for="(chat, index) in chatMessages" :key="index" :chat="chat" />
    </div>
    <div class="input-area">
      <div class="full-width">
        <input @keyup.enter="sendChat" placeholder="Type your message here..." type="text" v-model="input" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import idols from '@/assets/data/idols.json';
import axios from 'axios';
import ChatMessage from '@/components/ChatMessage.vue';
import type Idol from '@/interfaces/_IIdol.ts';
import type Idols from '@/interfaces/_IIdols.ts';
import type Message from '@/interfaces/_IMessage.ts';

export default defineComponent({
  name: 'Chat',
  data() {
    return {
      idolData: {} as Idol,
      chatHistory: [] as any,
      chatMessages: [] as Message[],
      input: '',
    };
  },
  mounted() {
    this.fetchIdolData();
    this.loadChatHistory();
  },
  updated() {
    this.$nextTick(() => this.scrollToEnd());
  },
  components: {
    ChatMessage
  },
  methods: {
    scrollToEnd() {
      this.$nextTick(() => {
        const chatArea = this.$el.querySelector('.chat-container');
        if (chatArea) {
          chatArea.scrollTop = chatArea.scrollHeight;
        }
      });
    },
    loadChatHistory() {
      const history = localStorage.getItem('chatHistory');
      if (history) {
        this.chatHistory = JSON.parse(history);
        console.log(this.chatHistory);
      }
    },
    fetchIdolData() {
      const idolName = this.$route.params.idolName as string;
      if (idolName && (idols as Idols).hasOwnProperty(idolName)) {
        this.idolData = (idols as Idols)[idolName];
      } else {
        this.idolData = { display_name: 'Unknown', profile_picture: 'default.jpg' };
      }
    },
    async sendChat() {
      if (this.input.trim() !== '') {
        const newUserMessage = { role: 'user', content: this.input };
        this.chatHistory.push(newUserMessage);
        this.chatMessages.push(newUserMessage);
        console.log(this.chatMessages);
        localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
        this.input = '';

        try {
          const response = await axios.post('http://localhost:3000/message', {
            chatHistory: this.chatHistory,
          });

          const minjiReply = response.data.reply.choices[0].message.content;
          this.chatHistory.push({ role: 'assistant', content: minjiReply });
          localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
          this.chatMessages.push({ role: 'assistant', content: JSON.parse(minjiReply)});
          console.log(this.chatMessages);
        } catch (error) {
          console.error('Error sending chat:', error);
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.page.chat {
  background-color: #fff2fc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .overview-header {
    display: flex;
    align-items: flex-end;
    padding-bottom: 12px;
    padding-top: 20px;
    background-color: white;
    filter: drop-shadow(0px 0px 3px #0000001f);

    .full-width {
      width: 100%;
      display: flex;
      gap: 15px;

      .chat-header-text {
        font-family: 'Roboto';
        display: flex;
        flex-direction: column;
        justify-content: center;

        p {
          color: rgba(0, 0, 0, 0.342);
          font-size: 14px;
        }
      }

      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
  }

  .chat-container {
    display: flex;
    flex-grow: 1;
    padding-top: 15px;
    padding-bottom: 15px;
    width: 100%;
    gap: 20px;
    flex-direction: column;
    height: 0;
    overflow: scroll;
    justify-content: flex-start;

    & > :first-child { 
      margin-top: auto 
    }
  }

  .input-area {
    padding: 15px 0 15px 0;
    display: flex;
    gap: 15px;
    background-color: white;
    filter: drop-shadow(0px 0px 3px #0000001f);

    .full-width {
      width: 100%;
      display: flex;
      gap: 15px;

      button {
        border-radius: 50%;
        border: none;
        width: 45px;
        height: 45px;
        background-color: rgb(242, 101, 247);
        color: white;
        font-family: 'Roboto';
        font-weight: 700;
        font-size: 1.25rem;
      }

      input {
        height: 44px;
        flex-grow: 1;
        border: none;
        border-radius: 999px;
        padding-left: 15px;
        border: 1px solid rgba(0, 0, 0, 0.082);

        &:focus {
          outline: none;
        }

        &::placeholder {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
