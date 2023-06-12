<template>
  <div id="overlay">
    <div v-if="regionClickName === ''">
      <h4>Please click on a region</h4>
    </div>
    <div v-else>
      <h4>Region: {{ regionClickName }}</h4>
      <p><u>Choose your configuration</u></p>
      <p>Number of computers</p>
      <input
        type="range"
        min="1"
        max="50"
        step="1"
        v-model="ComputerNum"
        @input="calculateCarbonIntensity"
      />
      <div class="slider-value">{{ ComputerNum }}</div>
      <p><u>Calculated Carbon Intensity</u></p>
      <p>{{ calculatedCarbonIntensity }} kg CO2 / kWh</p>
      <button id="create-button" @click="createDataCenter">Create</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MapOverlay",
  props: {
    regionClickIntensity: {
      type: Number,
    },
    regionClickName: {
      type: String,
    },
  },
  data() {
    return {
      ComputerNum: 1,
      calculatedCarbonIntensity: 0,
    };
  },
  watch: {
    regionClickIntensity() {
      this.calculateCarbonIntensity();
    },
  },
  methods: {
    calculateCarbonIntensity() {
      this.calculatedCarbonIntensity =
        // TODO: Which numbers to use?
        ((this.regionClickIntensity * this.ComputerNum * 3) / 1000).toFixed(2);
    },
    createDataCenter() {
      //Send data to backend and create icon, maybe not in the overlay, but in MapView.vue ?
      //Maybe useing something like: this.$emit('createDataCenterClicked');
    },
  },
};
</script>
