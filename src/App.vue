<template>
  <RouterView />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  mounted() {
    window.addEventListener('resize', this.appHeight);
    this.appHeight();
  },
  methods: {
    appHeight() {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    },
  },
});
</script>

<style lang="scss">
#app {
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.page {
  min-height: 100vh;
  height: 100%;
}

:root {
  --app-height: 100%;
}

html,
body {
  padding: 0;
  margin: 0;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  height: var(--app-height);
}
</style>
