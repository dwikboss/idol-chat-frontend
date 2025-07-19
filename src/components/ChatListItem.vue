<template>
  <div class="chat-list-item" @click="openChat">
    <img :src="`/images/profile_pictures/${profilePicture}`" alt="Profile Picture" />
    <div class="name">
      <p>{{ displayName }}</p>
      <p>{{ realName }}</p>zz
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChatListItem',
  props: {
    name: String,
    displayName: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
    },
    realName: {
      type: String,
      required: true,
    },
  },
  methods: {
    openChat() {
      this.$router.push({ name: 'Chat', params: { idolName: this.name } });
    },
  },
});
</script>

<style lang="scss" scoped>
.chat-list-item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 15px;
  padding: 15px 15px 15px 15px;
  background-color: white;
  border-radius: 15px;
  border: 1px solid black;

  .name {
    p {
      font-family: 'Roboto';
      font-weight: 700;
      font-size: 20px;

      &:nth-of-type(2) {
        font-size: 14px;
        font-weight: 300;
        color: rgb(126, 126, 126);
      }
    }
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid #a7e765;
  }
}

h1 {
  color: black;
}
</style>
