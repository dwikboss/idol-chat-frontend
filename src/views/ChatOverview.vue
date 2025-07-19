<template>
  <div class="page overview">
    <div class="overview-header">
      <div class="full-width">
        <div class="msg-logo">
          <h1>Yuni Shara</h1>
        </div>
      </div>
    </div>
    <div class="full-width home-splash">
      <div class="chat-list">
        <button class="chat-button" @click="openChat()">Open chat!</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChatListItem from '@/components/ChatListItem.vue';
import idols from '@/assets/data/idols.json';

export default defineComponent({
  name: 'ChatOverview',
  components: {
    ChatListItem,
  },
  data() {
    return {
      idols,
    };
  },
  methods: {
    openChat() {
      this.$router.push('/chat');
    },
    clearHistory() {
      let text = 'Are you sure you want to delete your chat history?';
      if (confirm(text) == true) {
        text = 'Chat history deleted';
        localStorage.removeItem('chatHistoryDisplay');
        localStorage.removeItem('chatHistory');
        localStorage.removeItem('photoSent');
      } else {
        text = 'Aborted';
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@media (min-width: 992px) {
  .nwjns-logo {
    width: 20vw !important;
  }
}

.page.overview {
  background: rgb(226, 26, 26);
  background: linear-gradient(180deg, rgb(226, 93, 93) 0%, rgba(255, 255, 255, 1) 100%);
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-position: center center;
  background-image: url('/images/profile_pictures/yuni-sharapfp.jpg');
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(226, 93, 93, 0.637) 0%, rgba(255, 255, 255, 0.623) 100%);
  }

  .dot-overlay {
    background-image: radial-gradient(#ffffff 1.5px, transparent 1.5px);
    background-size: 18px 18px;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.4;
  }

  .overview-header {
    height: 30vh;

    .full-width {
      justify-content: flex-end;
      align-items: center;
      height: 100%;

      .msg-logo {
        display: flex;
        justify-content: center;

        .nwjns-logo {
          width: 90%;
          margin-top: 75px;
          animation: tilt-logo 2s linear infinite;
          z-index: 999;
        }

        h1 {
          color: #ffffff;
          font-size: 4rem;
          text-transform: uppercase;
          font-weight: 900;
          letter-spacing: 5px;
          color: white;
          line-height: 1;
        }

        h2 {
          font-family: 'Micro 5 Charted', sans-serif;
          font-size: 2.2rem;
          font-weight: 100;
          color: black;
        }
      }
    }
  }

  .minji-sb {
    height: 70vh;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 998;
  }

  @media (min-width: 992px) {
    .minji-sb {
      // width: 25vw;
    }
  }

  .bunny {
    width: 42%;
    position: absolute;
    left: -10px;
    top: 32%;
    animation: pulse 1.5s linear infinite;
  }

  .full-width {
    display: flex;
    flex-direction: column;
    align-items: center;

    .clear-chathistory {
      margin-top: 25px;
      background-color: rgb(221, 78, 78);
      width: 100%;
      color: white;
      font-family: 'Times New Roman', Times, serif;
      text-align: center;
      padding: 5px;
      margin-bottom: 0 auto;
    }

    .chat-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 15px;

      .chat-button {
        background-color: rgb(182, 51, 51);
        color: white;
        text-transform: uppercase;
        font-weight: 900;
        padding: 12px 35px 12px 35px;
        border-radius: 99px;
        position: fixed;
        width: 80%;
        letter-spacing: 5px;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 999;
        font-family: Helvetica;
        font-size: 24px;
        text-align: center;
        text-decoration: none;
        z-index: 999;
        border: none !important;
      }
    }
  }

  h1 {
    margin-top: 32px;
    margin-bottom: 16px;
    text-align: center;
  }

  h2 {
    font-family: 'Roboto';
    color: black;
    font-weight: 600;
  }
}

@keyframes tilt-logo {
  0% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(-10deg);
  }
}

@keyframes pulse {
  0% {
    scale: (1);
  }
  50% {
    scale: (1.1);
  }
  100% {
    scale: (1);
  }
}
</style>
