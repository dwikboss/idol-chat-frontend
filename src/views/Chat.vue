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
        <div class="back-btn" @click="back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 12H5M12 19L5 12L12 5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <img src="/images/profile_pictures/yuni-sharapfp.jpg" alt="Profile Picture" />
        <div class="chat-header-text">
          <h4>Yuni Shara</h4>
          <p v-if="loading">{{ typeMessage }}</p>
          <p v-else>Online</p>
        </div>
        <!-- Wrap music and settings buttons in a right-aligned flex container -->
        <div class="header-actions">
          <button class="music-btn styled-header-btn" @click="showMusicPopup = true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17V5l12-2v12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="6" cy="18" r="3" stroke="white" stroke-width="2"/>
              <circle cx="18" cy="16" r="3" stroke="white" stroke-width="2"/>
            </svg>
          </button>
          <div class="settings-btn" @click="openSettings">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
        <!-- Music popup -->
        <div v-if="showMusicPopup" class="music-popup-overlay" @click="showMusicPopup = false">
          <div class="music-popup" @click.stop>
            <div class="music-popup-content">
              <div class="song-list-popup">
                <button v-for="song in songs" :key="song" class="song-btn" @click="selectSong(song)">
                  <span class="song-title">{{ song.replace(/\.mp3$/, '') }}</span>
                </button>
              </div>
            </div>
          </div>
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
        <!-- Image upload button and hidden file input -->
        <input type="file" accept="image/*" ref="imageInput" style="display: none" @change="onImageSelected" />
        <button @click="($refs.imageInput as HTMLInputElement).click()" title="Upload Image">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 16V4M12 4L8 8M12 4L16 8"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <rect x="4" y="16" width="16" height="4" rx="2" stroke="currentColor" stroke-width="2" />
          </svg>
        </button>
        <button @click="sendChat('')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22 2L11 13"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import idols from '@/assets/data/idols.json';
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
      availableImages: [
        'image.jpg',
        'image2.jpg',
        'image3.jpg',
        'image4.jpg',
        'image5.jpg',
        'image6.jpg',
        'image7.jpg',
      ],
      showMusicPopup: false,
      songs: [
        'Yuni Shara - Maafkan (Official Lyric Video).mp3',
        'Yuni Shara - Singkong & Keju (Official Music Video).mp3',
        'Yuni Shara - Mengapa Tiada Maaf [Official Music Video].mp3',
        'Yuni Shara - Tuhan Jagakan Dia (Official Music Video).mp3',
      ],
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
      return this.voiceEvent ? 'Recording voice message...' : 'Typing...';
    },
  },
  methods: {
    getRandomImage() {
      const randomIndex = Math.floor(Math.random() * this.availableImages.length);
      return this.availableImages[randomIndex];
    },
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
          '-1-Act as tho you want to show the user something real quick. Its a random picture from a vacation in indonesia that was taken by the user, it acts like a kind of memory of the user. On the front-end the user will now see a picture of you.'
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
              " -- [WARNING! THIS USER HAS TRIGGERED A VOICE MESSAGE REPLY. REPLY TO THIS USER AS IF YOU'RE SENDING IT THROUGH A VOICE MESSAGE, REPLY IN Indonesian. REPLY TO THE USER'S QUERY BUT IN A VOICE MESSAGE MANNER. ALSO ADHERE TO THE SAME JSON STRUCTURE LIKE BEFORE BUT THIS TIME THE Indonesian AND DUTCH TRANSLATIONS CAN BE THE SAME: {'Indonesian': '<VOICE MESSAGE REPLY>', 'Dutch': '<SAME VOICE MESSAGE REPLY>'}] THIS IS THE FIRST VOICE MESSAGE, SO INCLUDE IN THE VOICE MESSAGE THAT YOURE BUSY OR DOING SOMETHING OR WALKING OR WHATEVER TO LET THE USER KNOW THAT WHY YOURE SENDING A VOICE MESSAGE";
          } else {
            inputConstr =
              this.input +
              " -- [WARNING! THIS USER HAS TRIGGERED ANOTHER VOICE MESSAGE REPLY. REPLY TO THIS USER AS IF YOU'RE SENDING IT THROUGH A VOICE MESSAGE, REPLY IN Indonesian. REPLY TO THE USER'S QUERY BUT IN A VOICE MESSAGE MANNER. ALSO ADHERE TO THE SAME JSON STRUCTURE LIKE BEFORE BUT THIS TIME THE Indonesian AND DUTCH TRANSLATIONS CAN BE THE SAME: {'Indonesian': '<VOICE MESSAGE REPLY>', 'Dutch': '<SAME VOICE MESSAGE REPLY>'}]";
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
              media: this.getRandomImage(),
              grouped_message: this.nextMessageGroup || false,
            });
            this.nextMsgPhoto = false;
          } else if (this.voiceEvent) {
            const prepVoice = JSON.parse(minjiReply).Indonesian;
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
        const url = 'https://api.elevenlabs.io/v1/text-to-speech/Q5DQYbkqnIsFbEUJYmGK';
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
    async onImageSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input && input.files && input.files[0]) {
        const file = input.files[0];
        const formData = new FormData();
        formData.append('image', file);

        // 🔄 Send image to your backend's proxy upload endpoint
        axios
          .post('https://idol-chat-backend-production.up.railway.app/proxy-upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then(async (response) => {
            const imageUrl = response.data.url;

            // Format OpenAI-compatible vision message
            const imageMessage = {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'What do you see in this image?',
                },
                {
                  type: 'image_url',
                  image_url: { url: imageUrl },
                },
              ],
            } as Message;

            this.chatHistory.push(imageMessage);
            this.chatMessages.push(imageMessage);
            this.scrollToEnd();

            localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
            localStorage.setItem('chatHistoryDisplay', JSON.stringify(this.chatMessages));

            // Send to OpenAI backend
            this.loading = true;
            try {
              const aiResponse = await axios.post('https://idol-chat-backend.vercel.app/message', {
                chatHistory: this.chatHistory,
              });
              const minjiReply = aiResponse.data.reply.choices[0].message.content;

              this.chatHistory.push({ role: 'assistant', content: minjiReply } as Message);
              this.chatMessages.push({ role: 'assistant', content: JSON.parse(minjiReply) } as Message);

              localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
              localStorage.setItem('chatHistoryDisplay', JSON.stringify(this.chatMessages));
              this.scrollToEnd();
            } catch (err) {
              console.error('Error sending image to AI:', err);
            } finally {
              this.loading = false;
            }
          })
          .catch((err) => {
            console.error('Image upload failed:', err);
            alert('Image upload failed. Please try again.');
          });
      }
    },
    selectSong(song) {
      // Add an assistant message with the song (audio player)
      const songMessage = {
        role: 'assistant',
        content: [
          { type: 'text', text: `🎵 ${song.replace(/\.mp3$/, '')}` },
          { type: 'audio', audio_url: { url: `/songs/${song}` } }
        ]
      };
      this.chatHistory.push(songMessage);
      this.chatMessages.push(songMessage);
      this.scrollToEnd();
      localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
      localStorage.setItem('chatHistoryDisplay', JSON.stringify(this.chatMessages));
      this.showMusicPopup = false;
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
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;

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

      .header-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 25px;
        margin-left: auto;
      }
      .settings-btn {
        /* Remove flex-grow and align right */
        flex-grow: 0 !important;
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
        background: white;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #374151;
        border: 1px solid #e5e7eb;
        border-radius: 50%;
        align-self: center;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        font-size: 18px;
        font-weight: 500;

        &:hover {
          background: #f9fafb;
          border-color: #d1d5db;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          transform: translateY(-1px);
        }

        &:active {
          transform: translateY(0);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
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
    display: flex;
    gap: 12px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    position: fixed;
    z-index: 999;
    bottom: 0;
    height: 80px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

    .full-width {
      width: 100%;
      display: flex;
      gap: 12px;
      align-items: center;

      button {
        height: 48px;
        width: 48px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px;
        font-weight: 600;
        background: linear-gradient(135deg, #dc2626 0%, #f87171 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
        }

        &:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
        }

        svg {
          transition: transform 0.2s ease;
        }

        &:hover svg {
          transform: scale(1.1);
        }
      }

      input {
        height: 48px;
        flex-grow: 1;
        padding: 0 20px;
        border: 2px solid #e5e7eb;
        border-radius: 999px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 15px;
        background: white;
        transition: all 0.2s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

        &:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        &::placeholder {
          color: #9ca3af;
          font-weight: 400;
        }
      }
    }
  }
}
.music-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.music-popup {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  z-index: 1001;
  min-width: 300px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.music-popup-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.music-btn.styled-header-btn {
  height: 38px;
  width: 38px;
  background: linear-gradient(135deg, #dc2626 0%, #f87171 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 2px;
  margin-right: 0;
  padding: 0;
}
.music-btn.styled-header-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}
.music-btn.styled-header-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
}
.music-btn.styled-header-btn svg {
  width: 18px;
  height: 18px;
}
.music-btn.styled-header-btn:hover svg {
  transform: scale(1.1);
}
.song-list-popup {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
.song-btn {
  background: linear-gradient(135deg, #dc2626 0%, #f87171 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 15px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  box-shadow: 0 1px 4px rgba(220, 38, 38, 0.08);
  transform: scale(1);
}
.song-title {
  font-size: 14px;
  font-weight: 500;
  color: white;
}
</style>
