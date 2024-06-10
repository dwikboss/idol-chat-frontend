<template>
  <div v-if="settingsOpen" class="settings-modal">
    <h3>Settings</h3>
    <div class="chat-broken">
      <p>Broken chat?</p>
      <button class="settings-button" @click="clearHistory">Reset & Delete chat history</button>
    </div>
    <div class="chat-broken">
      <p>Force image event</p>
      <button class="settings-button" @click="forceImage">Force image</button>
    </div>
    <div class="voice-settings">
      <p>Force chat into voice event</p>
      <p style="color: red" v-if="voiceEvent">
        The chat is currently in a voice event with {{ 4 - voiceMessages }} voice messages left!
      </p>
      <button class="settings-button" @click="forceVoice">Enable</button>
    </div>
    <button class="close-button" @click="openSettings">Close settings</button>
    <!-- <div @click="clearHistory" class="clear-chathistory">
        click here if your chat is broken (you will lose your chat history tho 😔)
      </div> -->
  </div>
  <div class="page chat">
    <div class="overview-header">
      <div class="full-width">
        <div class="back-btn" @click="back">&#60;</div>
        <img src="/images/profile_pictures/minji.jpg" alt="Profile Picture" />
        <div class="chat-header-text">
          <h4>✨민지✨</h4>
          <p v-if="loading">{{ typeMessage }}</p>
          <p v-else>Online</p>
        </div>
        <div class="settings-btn" @click="openSettings">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
    <div class="chat-container full-width" ref="chatContainer">
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
      voiceMessageUrl: '' as any,
      amountOfVM: 0,
      settingsOpen: false,
      imageChance: 0.25,
    };
  },
  mounted() {
    this.loadChatHistory();
    this.scrollToEnd();
    if (!localStorage.getItem('photoSent')) {
      localStorage.setItem('photoSent', 'false');
    }
  },
  updated() {
    this.scrollToBottom();
  },
  components: {
    ChatMessage,
  },
  computed: {
    typeMessage() {
      return this.voiceEvent ? 'Recording voice message...' : 'Typing...'
    }
  },
  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer as HTMLDivElement;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    forceVoice() {
      if (!this.voiceEvent) {
        this.voiceEvent = true;
      }
    },
    forceImage() {
      this.imageChance = 0.99;
    },
    openSettings() {
      this.settingsOpen = !this.settingsOpen;
    },
    clearHistory() {
      let text = 'Are you sure you want to delete your chat history?';
      if (confirm(text) == true) {
        text = 'Chat history deleted';
        localStorage.removeItem('chatHistoryDisplay');
        localStorage.removeItem('chatHistory');
        localStorage.removeItem('photoSent');
        this.$router.push('/');
      } else {
        text = 'Aborted';
      }
    },
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
            voice: msg.voice,
          }))
        : [];
    },
    async sendChat(customContent: string) {
      if (!this.voiceEvent) {
        if (Math.random() < 0.01) {
          this.voiceEvent = true;
        }
      } else if (this.voiceMessages == 3) {
        this.voiceMessages = 0;
        this.voiceEvent = false;
        console.log('done');
        console.log(this.voiceMessages);
      }

      if (this.input.trim() !== '') {
        let inputConstr;
        if (this.voiceEvent) {
          console.log();
          if (this.voiceMessages == 0) {
            inputConstr =
              this.input +
              " -- [WARNING! THIS USER HAS TRIGGERED A VOICE MESSAGE REPLY. REPLY TO THIS USER AS IF YOU'RE SENDING IT THROUGH A VOICE MESSAGE, REPLY IN ENGLISH AND USE HANGUL TO ACT LIKE MINJI IS LOOKING FOR THE RIGHT WORDS, USING HANGUL TO ACT AS THO MINJI IS TRYING TO FIND THE RIGHT WORDS IN ENGLISH E.G. 'okay i do voice message real quick because i'm walking to the practice room. but uhm... 그건 또 어떻게 말해요? oh right, what did you do today?' OR SOMETHING LIKE THAT. BE CREATIVE AND CHANGE IT UP. REPLY TO THE USER'S QUERY BUT IN A VOICE MESSAGE MANNER. ALSO ADHERE TO THE SAME JSON STRUCTURE LIKE BEFORE BUT THIS TIME THE ENGLISH AND KOREAN TRANSLATIONS CAN BE THE SAME: {'English': '<VOICE MESSAGE REPLY>', 'Korean': '<SAME VOICE MESSAGE REPLY>'}] FOR NOW, DONT USE SPECIAL CHARACTERS EXCEPT FOR KOREAN HANGUL BECAUSE THE VOICE API CANT PROCESS ~ OR ANYTHING OF THE SORTS. THIS IS THE FIRST VOICE MESSAGE, SO INCLUDE IN THE VOICE MESSAGE THAT YOURE BUSY OR DOING SOMETHING OR WALKING OR WHATEVER TO LET THE USER KNOW THAT WHY YOURE SENDING A VOICE MESSAGE";
          } else {
            inputConstr =
              this.input +
              " -- [WARNING! THIS USER HAS TRIGGERED ANOTHER VOICE MESSAGE REPLY. REPLY TO THIS USER AS IF YOU'RE SENDING IT THROUGH A VOICE MESSAGE, REPLY IN ENGLISH AND USE HANGUL TO ACT LIKE MINJI IS LOOKING FOR THE RIGHT WORDS, USING HANGUL TO ACT AS THO MINJI IS TRYING TO FIND THE RIGHT WORDS IN ENGLISH E.G. 'yeah i get what youre saying. but uhm... 그건 또 어떻게 말해요? oh right, we do it differently here' OR SOMETHING LIKE THAT. REPLY TO THE USER'S QUERY BUT IN A VOICE MESSAGE MANNER. ALSO ADHERE TO THE SAME JSON STRUCTURE LIKE BEFORE BUT THIS TIME THE ENGLISH AND KOREAN TRANSLATIONS CAN BE THE SAME: {'English': '<VOICE MESSAGE REPLY>', 'Korean': '<SAME VOICE MESSAGE REPLY>'}] FOR NOW, DONT USE SPECIAL CHARACTERS EXCEPT FOR KOREAN HANGUL BECAUSE THE VOICE API CANT PROCESS ~ OR ANYTHING OF THE SORTS";
          }

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
        this.scrollToEnd();
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
            const prepVoice = JSON.parse(minjiReply).English;
            this.voiceMessageUrl = await this.fetchVoiceMessage(prepVoice);
            this.chatMessages.push({
              role: 'assistant',
              content: JSON.parse(minjiReply),
              grouped_message: false,
              voice: this.voiceMessageUrl,
            });
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
          this.scrollToEnd();
          if (
            this.userSentLast &&
            localStorage.getItem('photoSent') == 'false' &&
            Math.random() < this.imageChance &&
            !this.voiceEvent
          ) {
            this.nextMessageGroup = true;
            this.nextMsgPhoto = true;
            this.initBotConversation('photo');

            localStorage.setItem('photoSent', 'true');
            localStorage.setItem('chatHistoryDisplay', JSON.stringify(this.chatMessages));
          }

          if (this.userSentLast && Math.random() < 0.25 && !this.voiceEvent) {
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
    fetchVoiceMessage(prepVoice: string) {
      return new Promise((resolve, reject) => {
        const url = 'https://api.elevenlabs.io/v1/text-to-speech/4lnyefdHNMhcN6l8aob8';
        const data = {
          voice_settings: {
            style: 1,
            stability: 0.3,
            similarity_boost: 1,
            use_speaker_boost: true,
          },
          text: prepVoice,
          model_id: 'eleven_multilingual_v2',
        };
        const headers = {
          'xi-api-key': '1f6c178eb0662924d98bf8293241c540',
          'Content-Type': 'application/json',
        };

        axios({
          method: 'post',
          url: url,
          headers: headers,
          data: data,
          responseType: 'blob',
        })
          .then((response) => {
            const reader = new FileReader();
            reader.readAsDataURL(response.data);
            reader.onloadend = () => {
              const base64data = reader.result;
              resolve(base64data);
            };
            reader.onerror = (error) => reject(error);
          })
          .catch((error) => {
            console.error('Failed to fetch voice message:', error);
            reject(error);
          });
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.settings-modal {
  background-color: rgb(255, 255, 255);
  width: 90%;
  z-index: 999;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid black;
  padding: 25px;
  font-family: 'Helvetica';
  gap: 20px;
  display: flex;
  flex-direction: column;

  .settings-button {
    background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(125, 232, 6, 1) 100%);
    border: 1px solid black;
    font-size: 16px;
    width: 100%;
  }

  .close-button {
    background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgb(228, 31, 24) 100%);
    border: 1px solid black;
    font-size: 16px;
  }

}

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
    z-index: 998;

    .full-width {
      width: 100%;
      display: flex;
      gap: 15px;

      .settings-btn {
        flex-grow: 1;
        justify-content: center;
        display: flex;
        flex-direction: column;
        align-items: self-end;
        gap: 3px;

        .dot {
          border-radius: 50%;
          width: 5px;
          height: 5px;
          background-color: rgb(209, 209, 209);
        }
      }

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
    padding-bottom: calc(82px + 20px);
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
    position: fixed;
    z-index: 999;
    bottom: 0;
    height: 75px;

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
