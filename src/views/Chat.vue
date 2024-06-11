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
      <button @click="fetchVoiceMessage('hi everyone!')">Download Voice Message</button>
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
      voiceMessages: 0,
      nextMessageGroup: false,
      nextMsgPhoto: false,
      voiceEvent: false,
    };
  },
  mounted() {
    this.fetchIdolData();
    this.loadChatHistory();

    this.fetchVoiceMessage('lol');
  },
  updated() {
    this.$nextTick(() => this.scrollToEnd());
    if (!localStorage.getItem('photoSent')) {
      localStorage.setItem('photoSent', 'false');
    }
  },
  components: {
    ChatMessage,
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    initBotConversation(type: string) {
      if (type == 'photo') {
        this.sendChat(
          '-1-Act as tho you want to show the user something real quick. You just got coffee. Say something like "oh btw, look i just got coffee" or something along the lines of that. Say it in the style of how Minji would talk! Btw, on the front end, i will inject a pic of minji with a coffee so the user will see a pic with your message so talk accordingly if the user talks about it further.'
        );
      } else {
        this.sendChat(
          '-1-Continue that part of the conversation of what you just said in no more than 4 words. You can also react a bit more on what you just said.'
        );
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
      const displayHistory = localStorage.getItem('chatHistoryDisplay');

      this.chatHistory = history ? JSON.parse(history) : [];

      this.chatMessages = displayHistory
        ? JSON.parse(displayHistory).map((msg: any) => ({
            role: msg.role,
            content: msg.content,
            media: msg.media || '',
            grouped_message: msg.grouped_message || false,
          }))
        : [];
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
      if (!this.voiceEvent) {
        if (Math.random() < 0.9) {
          this.voiceEvent = true;
        }
      } else if (this.voiceMessages > 4) {
        this.voiceEvent = false;
        this.voiceMessages = 0;
      }

      if (this.input.trim() !== '') {
        if (this.voiceEvent) {
          const inputConstr =
            this.input +
            " -- [WARNING! THIS USER HAS TRIGGERED A VOICE MESSAGE REPLY. REPLY TO THIS USER AS IF YOU'RE SENDING IT THROUGH A VOICE MESSAGE, REPLY IN ENGLISH AND USE HANGUL TO ACT LIKE MINJI IS LOOKING FOR THE RIGHT WORDS, USING HANGUL TO ACT AS THO MINJI IS TRYING TO FIND THE RIGHT WORDS IN ENGLISH E.G. okay i do voice message real quick because i'm walking to the practice room. but uhm... 그건 또 어떻게 말해요? oh right, what did you do today? OR SOMETHING LIKE THAT. REPLY TO THE USER'S QUERY BUT IN A VOICE MESSAGE MANNER. ALSO ADHERE TO THE SAME JSON STRUCTURE LIKE BEFORE BUT THIS TIME THE ENGLISH AND KOREAN TRANSLATIONS CAN BE THE SAME: {'English': '<VOICE MESSAGE REPLY>', 'Korean': '<SAME VOICE MESSAGE REPLY>'}]";
          const newVoiceMessage = { role: 'user', content: inputConstr };
          const newUserMessage = { role: 'user', content: this.input };

          this.chatHistory.push(newVoiceMessage);
          this.chatMessages.push(newUserMessage);
          this.voiceMessages++;
        } else {
          const newUserMessage = { role: 'user', content: this.input };
          this.chatHistory.push(newUserMessage);
          this.chatMessages.push(newUserMessage);
        }

        this.userSentLast = true;
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

          if (this.nextMsgPhoto) {
            this.chatMessages.push({
              role: 'assistant',
              content: JSON.parse(minjiReply),
              media: 'minji_food_1.jpeg',
              grouped_message: this.nextMessageGroup || false,
            });
            this.nextMsgPhoto = false;
          } else if (this.voiceEvent) {
            const prepVoice = JSON.parse(minjiReply);
            console.log(prepVoice.English);
            const voiceMessageResponse = await this.fetchVoiceMessage(prepVoice);
            console.log(voiceMessageResponse);
          } else {
            this.chatMessages.push({
              role: 'assistant',
              content: JSON.parse(minjiReply),
              grouped_message: this.nextMessageGroup || false,
            });
          }

          this.nextMessageGroup = false;
          localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
          localStorage.setItem('chatHistoryDisplay', JSON.stringify(this.chatMessages));

          if (this.userSentLast && localStorage.getItem('photoSent') == 'false' && Math.random() < 0.85) {
            this.nextMessageGroup = true;
            this.nextMsgPhoto = true;
            this.initBotConversation('photo');

            localStorage.setItem('photoSent', 'true');
            localStorage.setItem('chatHistoryDisplay', JSON.stringify(this.chatMessages));
          }

          if (this.userSentLast && Math.random() < 0.25) {
            this.nextMessageGroup = true;
            this.initBotConversation('convo');
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
    async fetchVoiceMessage(text: string) {
      try {
        const response = await axios({
          method: 'post',
          url: 'https://api.elevenlabs.io/v1/text-to-speech/4lnyefdHNMhcN6l8aob8',
          headers: {
            'xi-api-key': '1f6c178eb0662924d98bf8293241c540',
            'Content-Type': 'application/json',
          },
          data: {
            voice_settings: {
              stability: 0.3,
              similarity_boost: 1,
              style: 1,
              use_speaker_boost: true,
            },
            text: text,
          },
          responseType: 'blob', // Set responseType to 'blob' for handling binary data
        });

        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'audio/mpeg' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'voiceMessage.mp3'); // Name the download file
        document.body.appendChild(link);
        link.click();
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      } catch (error) {
        console.error('Failed to fetch voice message:', error);
      }
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
