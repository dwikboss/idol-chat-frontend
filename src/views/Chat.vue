<template>
  <div class="page chat">
    <div class="overview-header">
      <div class="full-width">
        <img :src="`/images/profile_pictures/${idolData.profile_picture}`" alt="Profile Picture" />
        <div class="chat-header-text">
          <h3>{{ idolData.display_name }}</h3>
          <p>Online</p>
        </div>
      </div>
    </div>
    <div class="chat-container">
      <div class="full-width">
        <div class="chat-area">
          test
        </div>
        <div class="input-area">
          <input type="text">
          <button>></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type _Idol from '@/interfaces/_Idol.ts';
import type _Idols from '@/interfaces/_Idols.ts';
import idols from '@/assets/data/idols.json';

export default defineComponent({
  name: 'Chat',
  data() {
    return {
      idolData: {} as _Idols,
    };
  },
  mounted() {
    this.fetchIdolData();
  },
  methods: {
    fetchIdolData() {
      const idolName = this.$route.params.idolName as string;
      if (idolName && (idols as _Idols).hasOwnProperty(idolName)) {
        this.idolData = (idols as _Idols)[idolName];
      } else {
        this.idolData = { display_name: 'Unknown', profile_picture: 'default.jpg' };
      }
    },
  },
  props: {
    idolName: String,
  },
  components: {},
});
</script>

<style lang="scss" scoped>
.page.chat {
  background: rgb(255, 174, 245);
  background: linear-gradient(330deg, rgba(255, 174, 245, 1) 0%, rgba(0, 255, 248, 0.26094187675070024) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .overview-header {
    display: flex;
    align-items: flex-end;
    padding-bottom: 25px;
    padding-top: 25px;
    background-color: white;
    border-radius: 0 0 20px 20px;

    .full-width {
      width: 100%;
      display: flex;
      gap: 15px;

      .chat-header-text {
        font-family: 'Roboto';
        p {
          color: rgba(0, 0, 0, 0.342);
          font-size: 14px;
        }
      }

      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
  }

  .chat-container {
    height: 85vh;

    .full-width {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .chat-area {
        flex-grow: 1;
      }

      .input-area {
        padding: 15px 0 15px 0;
        display: flex;
        gap: 15px;
        
        button {
          border-radius: 50%;
          border: none;
          width: 40px;
          height: 40px;
          background-color: rgb(101, 226, 235);
        }

        input {
          height: 40px;
          flex-grow: 1;
          border: none;
          border-radius: 999px;
        }
      }
    }
  }
}
</style>
