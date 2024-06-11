<template>
  <div class="page chat">
    <div class="overview-header">
      <div class="full-width">
        <h3>{{ idolName }}</h3>
        <p>Online</p>
      </div>
    </div>
    <div class="full-width">
      <h2></h2>
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
      idolData: {},
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
  .overview-header {
    height: 10vh;
  }
}
</style>
