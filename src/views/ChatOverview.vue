<template>
  <div class="page overview">
    <div class="overview-header">
      <div class="full-width">
        <h2>Messages</h2>
      </div>
    </div>
    <div class="full-width">
      <div class="chat-list">
        <ChatListItem
          v-for="(idol, name) in idols"
          :key="name"
          :name="name"
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
  background: rgb(255, 174, 245);
  background: linear-gradient(330deg, rgba(255, 174, 245, 1) 0%, rgba(0, 255, 248, 0.26094187675070024) 100%);
  height: 100vh;

  .overview-header {
    height: 18vh;

    .full-width {
      justify-content: flex-end;
      align-items: flex-start;
      height: 100%;

      h2 {
        margin-bottom: 25px;
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
