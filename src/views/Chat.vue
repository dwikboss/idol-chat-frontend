<template>
  <div class="page chat">
    <div class="overview-header">
      <div class="full-width">
        <img :src="`/images/profile_pictures/${idolData.profile_picture}`" alt="Profile Picture" />
        <div class="chat-header-text">
          <h4>{{ idolData.display_name }}</h4>
          <p>Online</p>
        </div>
      </div>
    </div>
    <div class="chat-container">
      <div class="full-width">
        <div class="chat-area">test</div>
      </div>
    </div>
    <div class="input-area">
      <div class="full-width">
        <input type="text" />
        <button>></button>
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
    this.initChatData();
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
    initChatData() {
      
    }
  },
  props: {
    idolName: String,
  },
  components: {},
});
</script>

<style lang="scss" scoped>
.page.chat {
  background-color: #fff2fc;
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

    .full-width {
      width: 100%;
      display: flex;
      gap: 15px;

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
      }
    }
  }

  .chat-container {
    flex-grow: 1;

    .full-width {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .chat-area {
        flex-grow: 1;
      }
    }
  }

  .input-area {
    padding: 15px 0 15px 0;
    display: flex;
    gap: 15px;
    background-color: white;
    filter: drop-shadow(0px 0px 3px #0000001f);

    .full-width {
      width: 100%;
      display: flex;
      gap: 15px;

      button {
        border-radius: 50%;
        border: none;
        width: 45px;
        height: 45px;
        background-color: rgb(242, 101, 247);
        color: white;
        font-family: 'Roboto';
        font-weight: 700;
        font-size: 1.25rem;
      }

      input {
        height: 44px;
        flex-grow: 1;
        border: none;
        border-radius: 999px;
        padding-left: 15px;
        border: 1px solid rgba(0, 0, 0, 0.082);
      }

      input:focus {
        outline: none;
      }
    }
  }
}
</style>
