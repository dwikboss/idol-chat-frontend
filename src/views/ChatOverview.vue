<template>
  <div class="page overview">
    <div class="dot-overlay"></div>
    <div class="overview-header">
      <div class="full-width">
        <div class="msg-logo">
          <img class="nwjns-logo" src="/images/minji-chat-logo.png" alt="nwjns logo" />
        </div>
      </div>
    </div>
    <img class="minji-sb" src="/images/minji-sb.png" alt="minji" />
    <!-- <img  class="minji-sb" src="/images/minji-home.png" alt="minji" /> -->
    <!-- <img class="bunny" src="/images/bunny.png" alt="bunny" /> -->
    <div class="full-width home-splash">
      <div class="chat-list">
        <button class="chat-button" @click="openChat()">Open chat!</button>
      </div>
      <!-- <div @click="clearHistory" class="clear-chathistory">
        click here if your chat is broken (you will lose your chat history tho 😔)
      </div> -->
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
  background: rgb(118, 138, 195);
  background: linear-gradient(180deg, rgba(118, 138, 195, 1) 0%, rgba(255, 255, 255, 1) 100%);
  height: 100vh;
  overflow: hidden;

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
    position: fixed;
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
      border: 1px solid black;
      margin-bottom: 0 auto;
    }

    .chat-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 15px;

      .chat-button {
        background: rgb(255, 255, 255);
        background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(125, 232, 6, 1) 100%);
        padding: 10px 25px 10px 25px;
        border-radius: 99px;
        border: 1px solid black;
        -webkit-box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 1);
        -moz-box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 1);
        box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 1);
        position: fixed;
        width: 50%;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 999;
        font-family: Helvetica;
        font-size: 24px;
        text-align: center;
        color: black;
        text-decoration: none;
        z-index: 999;
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
