<template>
  <div class="container">
    <div class="profiles-column">
      <div
        v-for="profile in userStore.getUser.profiles"
        :key="profile.id"
        class="profile-card"
        @click="selectProfile(profile)"
      >
      <h3 class="profile-name">{{ profile.name }}</h3>
      <div class="profile-info">
        <p class="computers-label"><strong>Computers:</strong> {{ getProfileTotalComputers(profile) }}</p>
        <ul class="region-list">
          <li v-for="datacenter in profile.datacenter" :key="datacenter.regionid" class="region-item">
            <p class="region-info">
              {{ regionIdConverter(datacenter.regionId) }}: {{ datacenter.computerNum }} Computers
            </p>
          </li>
        </ul>
      </div>
      </div>
    </div>
    <div class="graph-container">
      <canvas ref="graphCanvas"></canvas>
    </div>
  </div>
</template>


<script>
import { useUserStore } from "../stores/userStore.js";
import Chart from "chart.js/auto";

export default {
  name: "StatsView",
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  mounted() {
    this.initializeGraph();
  },
  data() {
    this.graph = null;
    return{
      selectedProfiles: [], 
      colors: [
        'rgb(22,76,55)',
        'rgb(125,145,180)',
        'rgb(185,212,208)',
        'rgb(212,231,213)',
        'rgb(119,144,168)',
        'rgb(39,56,68)',
        'rgb(101,128,134)',
        'rgb(98,122,132)',
        'rgb(71,91,103)',
      ],
    };
  },
  methods: {
    regionIdConverter(input) {
      const regionMap = {
        1: "North Scotland",
        2: "South Scotland",
        3: "North West England",
        4: "North East England",
        5: "Yorkshire",
        6: "North Wales",
        7: "South Wales",
        8: "West Midlands",
        9: "East Midlands",
        10: "East England",
        11: "South West England",
        12: "South England",
        13: "London",
        14: "South East England",
      };
      // return regionMap[parseInt(input)] || "Region unknown";
      if (!isNaN(parseInt(input))) {
        return regionMap[parseInt(input)] || "Something went wrong1!";
      } else {
        const invertedMap = {};
        for (const [key, value] of Object.entries(regionMap)) {
          invertedMap[value] = parseInt(key);
        }
        return invertedMap[input] || "Something went wrong2!";
     }
    },
    getProfileTotalComputers(profile) {
      let totalComputers = 0;
      for (const datacenter of profile.datacenter) {
        totalComputers += parseInt(datacenter.computerNum);
      }
      return totalComputers;
    },
    selectProfile(profile) {
      const index = this.selectedProfiles.findIndex((selectedProfile) => parseInt(selectedProfile.id) === parseInt(profile.id));
      if(index !== -1){ //delete profile from array
        this.selectedProfiles.splice(index, 1);
      } else { //add profile to array
        console.log("profile:"+JSON.stringify(profile.id));
        this.selectedProfiles.push(profile);
      }
      console.log("profile added to array");
      this.updateGraph();
    },
    calculateActualValue(profile) {
      //dummy data
      const Values = { 1: 10, 2: 45, 3: 22, 4: 40, 5: 49, 6: 53, 7: 44, 8: 30, 9: 30, 10: 35, 11: 12, 12: 15, 13: 32, 14: 41, };
      let sum = 0;
      for (const datacenter of profile.datacenter) {
        const regionId = parseInt(datacenter.regionId);
        sum += parseInt(datacenter.computerNum * Values[regionId]);
      }
      return sum;
    },
    calculateForecastValue1(profile) {
      //dummy data
      const Values = { 1: 20, 2: 35, 3: 22, 4: 20, 5: 19, 6: 43, 7: 34, 8: 10, 9: 50, 10: 25, 11: 22, 12: 45, 13: 22, 14: 21, };
      let sum = 0;
      for (const datacenter of profile.datacenter) {
        const regionId = parseInt(datacenter.regionId);
        sum += parseInt(datacenter.computerNum * Values[regionId]);
      }
      return sum;
    },
    calculateForecastValue2(profile) {
      // dummy data
      const Values = { 1: 20, 2: 5, 3: 8, 4: 50, 5: 29, 6: 13, 7: 34, 8: 60, 9: 10, 10: 15, 11: 42, 12: 35, 13: 12, 14: 21, };
      let sum = 0;
      for (const datacenter of profile.datacenter) {
        const regionId = parseInt(datacenter.regionId);
        sum += parseInt(datacenter.computerNum * Values[regionId]);
      }
      return sum;
    },
    initializeGraph() {
      const graphCanvas = this.$refs.graphCanvas;
      this.graph = new Chart(graphCanvas, {
        type: "line",
        data: {
          labels: ["Today", "24h Forecast", "48h Forecast"],
          datasets: [],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'kg CO2 / kWh',
              },
            },
          },
        },
      });
      console.log("graph data"+JSON.stringify(this.graph.data.datasets));
    },
    updateGraph() {
      this.graph.data.datasets = [];
      this.selectedProfiles.forEach((profile, index) => {
        const actual = this.calculateActualValue(profile);
        const forecast1 = this.calculateForecastValue1(profile);
        const forecast2 = this.calculateForecastValue2(profile);

        const dataset = 
          {
            label: profile.name, 
            data: [actual, forecast1, forecast2],
            borderColor: this.colors[index],
            backgroundColor: this.colors[index], 
          };
        this.graph.data.datasets.push(dataset);
        });
      this.graph.update();
    },

  },
};
</script>

<style scoped>
.profile-name {
  font-size: 20px;
  font-weight: bold;
}

.computers-label {
  margin-bottom: 0;
  color: rgb(84, 84, 84);
}

.region-list {
  list-style: none;
  padding: 0;
}

.region-item {
  margin-bottom: 5px;
}

.region-info {
  margin: 0;
}

.profiles-column {
  width: 25%;
  height: 100%; 
  background-color: #f0f0f0;
  padding: 20px;
  border-left: none;
}

.profile-card {
  background-color: #eaeaea;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 10px;
  cursor: pointer;
}

.profile-card:hover {
  background-color: #d0d0d0;
}

.profile-info {
  margin-top: 5px;
}

ul {
  margin: 0;
  padding-left: 20px;
}

.graph-container {
  /* TODO layout verbessern */
  width: 100%;
  /* padding: 10%; */
  /* height: 100%; */
  display: flex;
  /* justify-content: center; */
  align-items: center;
}
.container {
  display: flex;
  margin-left: 0px;
  margin-right: 0px;
  padding: 0px;
}
</style>
