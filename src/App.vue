<template>
  <ScreenSizeWarning v-if="ShowScreenSizeWarning"/>
    <Header />
    <router-view />
</template>

<script>
import Header from "./components/Header.vue";
import ScreenSizeWarning from "./components/ScreenSize.vue";

export default {
  components: {
    Header,
    ScreenSizeWarning,
  },
  computed: {
    ShowScreenSizeWarning() {
      return this.isScreenSizeSmall;
    },
  },
};
</script>
