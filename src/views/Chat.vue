<template>
  <div class="page chat">
    <div class="overview-header">
      <div class="full-width">
        <div class="back-btn" @click="back">&#60;</div>
        <img :src="`/images/profile_pictures/${idolData.profile_picture}`" alt="Profile Picture" />
        <div class="chat-header-text">
          <h4>{{ idolData.display_name }}</h4>
          <p v-if="loading">Typing...</p>
          <p v-else>Online</p>
        </div>
      </div>
    </div>
    <div class="chat-container full-width">
      <ChatMessage v-for="(chat, index) in chatMessages" :key="index" :chat="chat" :idol="idolData" />
    </div>
    <div class="input-area">
      <div class="full-width">
        <input
          @keyup.enter="sendChat('')"
          placeholder="Type your message here..."
          type="text"
          v-model="input"
          ref="inputField"
        />
        <button @click="sendChat('')">send</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import idols from '@/assets/data/idols.json';
import axios from 'axios';
import ChatMessage from '@/components/ChatMessage.vue';
import type Idol from '@/interfaces/_IIdol';
import type Idols from '@/interfaces/_IIdols';
import type Message from '@/interfaces/_IMessage';

export default defineComponent({
  name: 'Chat',
  data() {
    return {
      idolData: {} as Idol,
      chatHistory: [] as any,
      chatMessages: [] as Message[],
      input: '',
      loading: false as boolean,
      sendChatCount: 0,
      userSentLast: false,
      retryCount: 0,
      maxRetries: 5,
      nextMessageGroup: false,
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
    ChatMessage,
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    initBotConversation() {
      this.sendChat(
        '-1-Continue that part of the conversation of what you just said in no more than 4 words. You can also react a bit more on what you just said.'
      );
    },
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
      const displayHistory = localStorage.getItem('chatHistoryDisplay');
      console.log(JSON.parse(displayHistory || '{}'));
      if (history) {
        this.chatHistory = JSON.parse(history);
        this.chatMessages = JSON.parse(displayHistory || '{}');
      }
    },
    fetchIdolData() {
      const idolName = this.$route.params.idolName as string;
      const idol = idols.find((idol) => idol.id === idolName);
      if (idol) {
        this.idolData = idol;
      } else {
        this.idolData = {
          id: 'unknown',
          display_name: 'Unknown',
          real_name: 'Unknown',
          profile_picture: 'default.jpg',
        };
      }
    },
    async sendChat(customContent: string) {
      if (this.input.trim() !== '') {
        this.userSentLast = true;
        const newUserMessage = { role: 'user', content: this.input };
        this.chatHistory.push(newUserMessage);
        this.chatMessages.push(newUserMessage);
        this.input = '';

        (this.$refs.inputField as HTMLInputElement).blur();
      } else if (customContent.trim() !== '') {
        this.userSentLast = false;
        const newUserMessage = { role: 'user', content: customContent };
        this.chatHistory.push(newUserMessage);
      }

      this.loading = true;

      const makeRequest = async () => {
        try {
          const response = await axios.post('https://idol-chat-backend.vercel.app/message', {
            chatHistory: this.chatHistory,
          });

          const minjiReply = response.data.reply.choices[0].message.content;
          this.chatHistory.push({ role: 'assistant', content: minjiReply });
          this.chatMessages.push({
            role: 'assistant',
            content: JSON.parse(minjiReply),
            grouped_message: this.nextMessageGroup,
          });
          this.nextMessageGroup = false;
          localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
          localStorage.setItem('chatHistoryDisplay', JSON.stringify(this.chatMessages));

          if (this.userSentLast && Math.random() < 0.25) {
            this.nextMessageGroup = true;
            this.initBotConversation();
          }

          this.loading = false;
          this.retryCount = 0;
        } catch (error) {
          console.error('Error sending chat:', error);
          if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            setTimeout(makeRequest, 2000);
          } else {
            this.loading = false;
            console.error('Max retries reached. Giving up.');
          }
        }
      };

      await makeRequest();
    },
  },
});
</script>

<style lang="scss" scoped>
.page.chat {
  background-image: repeating-conic-gradient(#8f9fd71c 0% 25%, #ffffff 0% 50%);
  background-position: 0 0, 32px 32px;
  background-size: 64px 64px;
  background-color: #ffffff;
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
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 999;

    .full-width {
      width: 100%;
      display: flex;
      gap: 15px;

      .back-btn {
        background-color: white;
        width: 25px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: black;
        border: 1px solid black;
        border-radius: 50%;
        align-self: center;
      }

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
        border: 1px solid black;
      }
    }
  }

  .chat-container {
    display: flex;
    flex-grow: 1;
    padding-top: calc(82px + 20px);
    padding-bottom: 20px;
    width: 100%;
    flex-direction: column;
    height: 0;
    overflow: auto;
    gap: 15px;
    justify-content: flex-start;

    & > :first-child {
      margin-top: auto;
    }
  }

  .input-area {
    width: 100%;
    padding: 15px 0 15px 0;
    display: flex;
    gap: 15px;
    border-top: 1px solid black;
    filter: drop-shadow(0px 0px 3px #0000001f);
    background-color: rgb(255, 255, 255);

    .full-width {
      width: 100%;
      display: flex;
      gap: 15px;
      align-items: center;

      button {
        border-style: inset;
        height: 100%;
        font-family: 'Times New Roman', Times, serif;
        width: 15%;
        font-size: 16px;
        background: rgb(255, 255, 255);
        background: linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(88 154 255) 100%);
        color: black;
      }

      input {
        height: 44px;
        flex-grow: 1;
        padding-left: 15px;
        border-style: inset;
        border-radius: 0px;

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
