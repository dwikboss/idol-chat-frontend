<template>
  <div class="page chat">
    <div class="overview-header">
      <div class="full-width">
        <img :src="`/images/profile_pictures/${idolData.profile_picture}`" alt="Profile Picture" />
        <div class="chat-header-text">
          <h4>{{ idolData.display_name }}</h4>
          <p v-if="loading">Typing...</p>
          <p v-else>Online</p>
        </div>
      </div>
    </div>
    <div class="chat-container full-width">
      <ChatMessage v-for="(chat, index) in chatMessages" :key="index" :chat="chat" />
    </div>
    <div class="input-area">
      <div class="full-width">
        <input @keyup.enter="sendChat('')" placeholder="Type your message here..." type="text" v-model="input" />
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
      randomMessages: [
        '-1-Can you act like youre gonna get something real quick. be creative, dont copy my example!',
        '-1-Can you act like youre gonna say hi to one of the members real quick becuase they just returned from doing something. switch it up! be creative, dont copy my example!',
        '-1-Can you act like youre super bored? Ask the user something like what theyre gonna do soon. use "btw" or something similar. switch it up! be creative, dont copy my example!',
        '-1-Can you ask for my opinion on a random thing about something youre talking about with the members? use "oh btw" or something similar. switch it up! be creative, dont copy my example!',
      ] as any,
      input: '',
      usedMessages: new Set(),
      loading: false as boolean,
    };
  },
  mounted() {
    this.fetchIdolData();
    this.loadChatHistory();
    this.startBotInitiationTimer();
  },
  updated() {
    this.$nextTick(() => this.scrollToEnd());
  },
  components: {
    ChatMessage,
  },
  methods: {
    startBotInitiationTimer() {
      const initiateConversation = () => {
        if (this.usedMessages.size >= this.randomMessages.length) {
          console.log('All random messages have been used. Stopping further messages.');
          return;
        }
        const delay = Math.random() * (8 * 60000 - 3 * 60000) + 1 * 60000;
        this.initBotConversation();
        setTimeout(initiateConversation, delay);
      };
      initiateConversation();
    },
    initBotConversation() {
      if (this.usedMessages.size < this.randomMessages.length) {
        let randomIndex;

        do {
          randomIndex = Math.floor(Math.random() * this.randomMessages.length);
        } while (this.usedMessages.has(randomIndex));

        this.usedMessages.add(randomIndex);
        const randomMessage = this.randomMessages[randomIndex];
        this.sendChat(randomMessage);
      } else {
        console.log('All messages have been used.');
      }
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
      if (history) {
        let parsedHistory = JSON.parse(history);
        this.chatHistory = JSON.parse(history);

        this.chatMessages = parsedHistory
          .filter((message: any) => {
            return !(message.role === 'user' && message.content.includes('-1-'));
          })
          .map((message: any) => {
            if (message.role === 'assistant' && typeof message.content === 'string') {
              try {
                message.content = JSON.parse(message.content);
              } catch (e) {
                console.error('Failed to parse message content', e);
              }
            }
            return message;
          });
      }
    },
    fetchIdolData() {
      const idolName = this.$route.params.idolName as string;
      const idol = idols.find((idol) => idol.id === idolName);
      if (idol) {
        this.idolData = idol;
      } else {
        this.idolData = { id: 'unknown', display_name: 'Unknown', profile_picture: 'default.jpg' };
      }
    },
    async sendChat(customContent: string) {
      if (this.input.trim() !== '') {
        const newUserMessage = { role: 'user', content: this.input };
        this.chatHistory.push(newUserMessage);
        this.chatMessages.push(newUserMessage);

        this.input = '';
      } else {
        if (customContent.trim() !== '') {
          const newUserMessage = { role: 'user', content: customContent };
          this.chatHistory.push(newUserMessage);
        }
      }

      this.loading = true;
      // https://idol-chat-backend-git-main-dwikys-projects.vercel.app/message
      try {
        const response = await axios.post('https://idol-chat-backend-git-main-dwikys-projects.vercel.app/message', {
          chatHistory: this.chatHistory,
        });

        const minjiReply = response.data.reply.choices[0].message.content;
        this.chatHistory.push({ role: 'assistant', content: minjiReply });
        this.chatMessages.push({ role: 'assistant', content: JSON.parse(minjiReply) });
        localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
        this.loading = false;
      } catch (error) {
        console.error('Error sending chat:', error);
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
    overflow: auto;
    justify-content: flex-start;

    & > :first-child {
      margin-top: auto;
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
