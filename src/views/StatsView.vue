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
              <!-- die region.id wird nicht korrekt zurückgegeben bzw ist wahrscheinlich nicht richtig gespeichert -->
              {{ regionIdConverter(datacenter.regionid) }}: {{ datacenter.computerNum }} Computers
              <!-- {{ datacenter.regionid }}: {{ datacenter.computerNum }} Computers -->
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
      const actual = this.calculateActualValue(profile);
      const forecast1 = this.calculateForecastValue1(profile);
      const forecast2 = this.calculateForecastValue2(profile);

      this.updateGraph(actual, forecast1, forecast2);
    },
    calculateActualValue(profile) {
      //dummy data
      const Values = { 
        1: 10,
        2: 45,
        3: 22,
        4: 40,
        5: 49,
        6: 53,
        7: 44,
        8: 30,
        9: 30,
        10: 35,
        11: 12,
        12: 15,
        13: 32,
        14: 41,
      };
      let sum = 0;
      for (const datacenter of profile.datacenter) {
        const regionId = parseInt(datacenter.regionid);
        sum += parseInt(datacenter.computerNum * Values[regionId]);
      }
      return sum;
    },
    calculateForecastValue1(profile) {
      //dummy data
      const Values = { 
        1: 10,
        2: 45,
        3: 22,
        4: 40,
        5: 49,
        6: 53,
        7: 44,
        8: 30,
        9: 30,
        10: 35,
        11: 12,
        12: 15,
        13: 32,
        14: 41,
      };
      let sum = 0;
      for (const datacenter of profile.datacenter) {
        const regionId = parseInt(datacenter.regionid);
        sum += parseInt(datacenter.computerNum * Values[regionId]);
      }
      return sum;
    },
    calculateForecastValue2(profile) {
      // dummy data
      const Values = { 
        1: 10,
        2: 45,
        3: 22,
        4: 40,
        5: 49,
        6: 53,
        7: 44,
        8: 30,
        9: 30,
        10: 35,
        11: 12,
        12: 15,
        13: 32,
        14: 41,
      };
      let sum = 0;
      for (const datacenter of profile.datacenter) {
        const regionId = parseInt(datacenter.regionid);
        sum += parseInt(datacenter.computerNum * Values[regionId]);
      }
      return sum;
    },
    initializeGraph() {
      const graphCanvas = this.$refs.graphCanvas;
      this.graph = new Chart(graphCanvas, {
        type: "line",
        data: {
          labels: ["Today", "1 Week Forecast", "2 Week Forecast"],
          datasets: [],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
    updateGraph(actual, forecast1, forecast2) {
      this.graph.data.datasets = [
        // TODO labels entfernen
        {
          label: "Actual",
          data: [actual, 0, 0],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Forecast 1",
          data: [0, forecast1, 0],
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.5)",
        },
        {
          label: "Forecast 2",
          data: [0, 0, forecast2],
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
      ];
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
  width: 20%;
  height: 100%; 
  background-color: #f0f0f0;
  padding: 20px;
  border-left: none;
  align-items: left;
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
  width: 80%;
  /* height: 100%; */
  /* flex: 1; */
  /* justify-content: flex-end;
  align-items: right; */
}
.container {
  display: flex;
}
</style>
