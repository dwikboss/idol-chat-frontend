<template>
  <div class="page overview">
    <div class="dot-overlay"></div>
    <div class="overview-header">
      <div class="full-width">
        <h2><span style="font-family: Helvetica, sans-serif;font-weight: 500;">M</span><span style="font-family: Briem Hand, cursive;font-weight: 200;font-style: italic;">e</span><span style="font-family: Helvetica, sans-serif;font-weight: 700;margin-left: 6px;">S</span><span style="font-family: Helvetica, sans-serif;font-weight: 200;">S</span><span style="font-family: Lora, serif;font-weight: 500;">a</span><span style="font-family: Helvetica, sans-serif;font-weight: 500;">g</span><span style="font-family: Briem Hand, cursive;font-weight: 500;">e</span><span style="font-family: Helvetica, sans-serif;font-weight: 500;">s</span></h2>
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
        />
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

    .full-width {
      justify-content: flex-end;
      align-items: flex-start;
      height: 100%;

      h2 {
        margin-bottom: 25px;
        font-family: "Micro 5 Charted", sans-serif;
        font-size: 3rem;
        font-weight: 100;
        color: white;
      }
    }
  }

  .full-width {
    display: flex;
    flex-direction: column;
    align-items: center;

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
