<template>
  <div class="screen-size-warning">
    <h2>Screen Size Error</h2>
    <p>
      This website is best viewed on a larger screen. Please resize your browser window or use a device with a larger screen to have the optimal viewing experience.
    </p>
  </div>
</template>

<script>
export default {
  name: 'ScreenSizeWarning',
};
</script>

<style scoped>
.screen-size-warning {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  z-index: 9999;
  text-align: center;
  font-family: Arial, sans-serif;
  background-color: #f8f8f8;
  color: #333;
}

.screen-size-warning h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.screen-size-warning p {
  font-size: 16px;
}
</style>
