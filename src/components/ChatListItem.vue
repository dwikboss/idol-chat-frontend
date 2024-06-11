<template>
   <div class="chat-list-item">
    <img :src="`/images/profile_pictures/${profilePicture}`" alt="Profile Picture" />
    <p>{{ displayName }}</p>
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
      required: true
    },
    profilePicture: {
      type: String,
      required: true
    }
  }
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

  p {
    font-family: 'Roboto';
    font-weight: 700;
    font-size: 20px;
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
h1 {
  color: black;
}
</style>
