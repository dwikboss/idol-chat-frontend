<template>
  <div class="page overview">
    <div class="dot-overlay"></div>
    <div class="overview-header">
      <div class="full-width">
        <!-- <img class="nwjns-logo" src="/images/nwjns.png" alt="nwjns logo"> -->
        <div class="msg-logo">
          <h2>
            <span style="font-family: Helvetica, sans-serif; font-weight: 500">M</span
            ><span style="font-family: Briem Hand, cursive; font-weight: 200; font-style: italic">e</span
            ><span style="font-family: Helvetica, sans-serif; font-weight: 500; margin-left: 6px; font-size: 1.6rem;">S</span
            ><span style="font-family: Helvetica, sans-serif; font-weight: 200; font-size: 1.6rem;">S</span
            ><span style="font-family: Lora, serif; font-weight: 500">a</span
            ><span style="font-family: Helvetica, sans-serif; font-weight: 500">g</span
            ><span style="font-family: Briem Hand, cursive; font-weight: 500">e</span
            ><span style="font-family: Times New Roman, serif; font-weight: 500; font-size: 2.5rem;">s</span>
          </h2>
        </div>
      </div>
    </div>
    <div class="full-width">
      <div class="chat-list">
        <ChatListItem
          v-for="idol in idols"
          :key="idol.id"
          :name="idol.id"
          :display-name="idol.display_name"
          :profile-picture="idol.profile_picture"
          :real-name="idol.real_name"
        />
      </div>
      <div @click="clearHistory" class="clear-chathistory">
        click here if your chat is broken (you will lose your chat history tho 😔 )
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
    clearHistory() {
      localStorage.removeItem('chatHistoryDisplay');
      localStorage.removeItem('chatHistory');
    }
  }
});
</script>

<style lang="scss" scoped>
.page.overview {
  background: rgb(118, 138, 195);
  background: linear-gradient(180deg, rgba(118, 138, 195, 1) 0%, rgba(255, 255, 255, 1) 100%);
  height: 100vh;

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
    height: 18vh;
    margin-bottom: 50px;

    .full-width {
      justify-content: flex-end;
      align-items: center;
      height: 100%;

      // .nwjns-logo {
      //   position: absolute;
      //   z-index: 0;
      //   width: 125px;
      //   transform: rotate(20deg);
      //   left: 220px;
      // }

      .msg-logo {
        display: flex;
        align-items: center;
        background: rgb(255, 255, 255);
        background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(125, 232, 6, 1) 100%);
        padding: 10px 25px 10px 25px;
        border-radius: 50%;
        border: 1px solid black;
        -webkit-box-shadow: 5px 5px 0px 0px rgba(0, 0, 0, 1);
        -moz-box-shadow: 5px 5px 0px 0px rgba(0, 0, 0, 1);
        box-shadow: 5px 5px 0px 0px rgba(0, 0, 0, 1);

        h2 {
          font-family: 'Micro 5 Charted', sans-serif;
          font-size: 2.2rem;
          font-weight: 100;
          color: black;
        }
      }
    }
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
</style>
