export default {
  data() {
    return {
      isScreenSizeSmall: false,
    };
  },
  mounted() {
    window.addEventListener('resize', this.checkScreenSize);
    this.checkScreenSize();
  },
  destroyed() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  methods: {
    checkScreenSize() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      this.isScreenSizeSmall = windowWidth < 1024 || windowHeight < 520;
    },
  },
};
