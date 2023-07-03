<template>
    <div class="mini-stats-overlay">
        <div v-if="datacenters.length>0" class="h2"> Datacenters </div>
      <div class="chart">
        <div v-for="datacenter in datacenters.sort((a,b )=> intensity[a.regionId-1]- intensity[b.regionId-1])"
          :key="datacenter.regionId">
          {{ regionIdConverter(datacenter.regionId) }} 

          <div class="bar rounded-pill" 
          :style="{ width: datacenter.computerNum * 8 + 'px', backgroundColor: getColor(intensity[datacenter.regionId - 1])}" >
         {{ datacenter.computerNum }}

        </div>
        </div>

      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "miniStatsOverlay",
    props: {
      datacenters: {
        type: Array,
        default: () => [],
      },
      intensity: {
        type: Array,
        default: () => [],
      }
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
      if (!isNaN(parseInt(input))) {
        return regionMap[parseInt(input)] || "Something went wrong!";
      } else {
        const invertedMap = {};
        for (const [key, value] of Object.entries(regionMap)) {
          invertedMap[value] = parseInt(key);
        }
        return invertedMap[input] || "Something went wrong!";
      }
    },
     getColor(d) {
        return d > 500
          ? "#c01c28"
          : d > 350
          ? "#ed333b"
          : d > 200
          ? "#ff7800"
          : d > 100
          ? "#f6d32d"
          : d > 50
          ? "#f9f06b"
          : d > 20
          ? "#8ff0a4"
          : d > 5
          ? "#33d17a"
          : "#26a269";
      }
    },
  };
  </script>
  
  <style scoped>
  .mini-stats-overlay {
    position: absolute;
    top: 45%;
    left: 20px;
    transform: translate(0, -50%);
    z-index: 9999;
  }
  
  .chart {
    display: flex;
    flex-direction: column;
  }
  
  .bar {
    background-color: #ffffff;
    margin-bottom: 0;
    text-align: center;
    font-weight: bold;
    color: #333;
    width: 0;
    height: 5
  }
  </style>
  