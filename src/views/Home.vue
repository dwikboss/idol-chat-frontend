<template>
  <div class="page home">
    <div class="full-width">
      <img class="logo" alt="Vue logo" src="@/assets/images/logos/logo.png" />
      <h1>Vue3 & TS Boilerplate</h1>
      <h2>Engagement</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
});
</script>

<style lang="scss" scoped>
.page.home {
  background-color: var(--black);
  height: 100vh;

  .full-width {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    .logo {
      max-width: 20h;
    }
  }

  h1 {
    margin-top: 32px;
    margin-bottom: 16px;
    color: var(--white);
    text-align: center;
  }

  h2 {
    color: var(--white);
    font-weight: 200;
  }
}
</style>
