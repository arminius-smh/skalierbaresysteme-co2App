<template>
  <div class="container">
    <div class="profiles-column">
      <div class="profile-list">
        <div
          v-for="profile in userStore.getUser.profiles.slice(1)"
          :key="profile.id"
          class="profile-card"
          @click="selectProfile(profile)"
        >
          <h3 class="profile-name">{{ profile.name }}</h3>
          <div class="profile-info">
            <p class="computers-label">
              <strong>Computers:</strong>
              {{ getProfileTotalComputers(profile) }}
            </p>
            <ul class="region-list">
              <li
                v-for="datacenter in profile.datacenter"
                :key="datacenter.regionid"
                class="region-item"
              >
                <p class="region-info">
                  {{ regionIdConverter(datacenter.regionId) }}:
                  {{ datacenter.computerNum }} Computers
                </p>
              </li>
            </ul>
          </div>
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
import axios from "axios";
import config from "../../config.mjs";

export default {
  name: "StatsView",
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  mounted() {
    this.getIntensityData()
      .then(() => {
        this.initializeGraph();
      })
      .catch((error) => {
        console.log(error);
      });
  },
  watch: {
    "userStore.getUser": function () {
      // if user logs out, route user to map page
      if (this.userStore.getUser === null) {
        this.$router.push("/");
      }
    },
  },
  data() {
    this.graph = null;
    return {
      selectedProfiles: [],
      colors: [
        "rgb(22,76,55)",
        "rgb(125,145,180)",
        "rgb(185,212,208)",
        "rgb(212,231,213)",
        "rgb(98,122,132)",
        "rgb(39,56,68)",
        "rgb(119,144,168)",
        "rgb(101,128,134)",
        "rgb(71,91,103)",
      ],
      intensityNow: [],
      intensity24h: [],
      intensity48h: [],
    };
  },
  methods: {
    async getIntensityData() {
      return new Promise((resolve, reject) => {
        const requests = [
          axios.get(`${config.serverURL}:${config.port}/co2data`),
          axios.get(`${config.serverURL}:${config.port}/co2data/fw24h`),
          axios.get(`${config.serverURL}:${config.port}/co2data/fw48h`),
        ];

        Promise.all(requests)
          .then(([responseNow, response24, response48]) => {
            this.intensityNow = responseNow.data.map(
              (region) => region.intensity.forecast
            );
            this.intensity24h = response24.data.map(
              (region) => region.intensity.forecast
            );
            this.intensity48h = response48.data.map(
              (region) => region.intensity.forecast
            );
            resolve();
          })
          .catch((error) => {
            console.error("Error fetching co2data:", error);
            reject(error);
          });
      });
    },
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
      const index = this.selectedProfiles.findIndex(
        (selectedProfile) =>
          parseInt(selectedProfile.id) === parseInt(profile.id)
      );
      if (index !== -1) {
        //delete profile from array
        this.selectedProfiles.splice(index, 1);
      } else {
        //add profile to array
        this.selectedProfiles.push(profile);
      }
      this.updateGraph();
    },
    calculateActualValue(profile) {
      const Values = this.intensityNow;
      let sum = 0;
      for (const datacenter of profile.datacenter) {
        const regionId = parseInt(datacenter.regionId);
        sum +=
          (Values[regionId - 1] / 1000) *
          datacenter.computerNum *
          0.118 *
          0.5 *
          24;
      }
      return sum;
    },
    calculateForecastValue1(profile) {
      const Values = this.intensity24h;
      let sum = 0;
      for (const datacenter of profile.datacenter) {
        const regionId = parseInt(datacenter.regionId);
        sum +=
          (Values[regionId - 1] / 1000) *
          datacenter.computerNum *
          0.118 *
          0.5 *
          24;
      }
      return sum;
    },
    calculateForecastValue2(profile) {
      const Values = this.intensity48h;
      let sum = 0;
      for (const datacenter of profile.datacenter) {
        const regionId = parseInt(datacenter.regionId);
        sum +=
          (Values[regionId - 1] / 1000) *
          datacenter.computerNum *
          0.118 *
          0.5 *
          24;
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
                text: "kg CO2",
              },
            },
          },
        },
      });
    },
    updateGraph() {
      this.graph.data.datasets = [];
      this.selectedProfiles.forEach((profile, index) => {
        const actual = this.calculateActualValue(profile);
        const forecast1 = this.calculateForecastValue1(profile);
        const forecast2 = this.calculateForecastValue2(profile);

        const dataset = {
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
.profile-list {
  height: 100%;
}

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
  height: 92vh;
  background-color: #f0f0f0;
  padding: 20px;
  border-left: none;
  overflow-y: scroll;
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
  width: 75%;
  padding-left: 10%;
  display: flex;
  align-items: center;
}

.container {
  display: flex;
  margin-left: 0px;
  margin-right: 0px;
  padding: 0px;
}

/* Scrollbar */
.profile-list::-webkit-scrollbar {
  width: 8px;
}

.profile-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.profile-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.profile-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
