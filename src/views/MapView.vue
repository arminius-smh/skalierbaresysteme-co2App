<template>
  <MapOverlay
    :regionClickIntensity="regionClickIntensity"
    :regionClickName="regionClickName"
  />
  <div id="map"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet/dist/leaflet.js";
import ukdata from "../assets/ukdata.json";
import MapOverlay from "../components/MapOverlay.vue";
//import dataCenterPng from "../assets/data-center-icon.png"

export default {
  name: "MapView",
  components: {
    MapOverlay,
  },
  data() {
    return {
      intensity: [],
      regionClickIntensity: -1,
      regionClickName: "",
    };
  },
  mounted() {
    this.getIntensityData()
      .then(() => {
        this.initalizeMap();
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    async getIntensityData() {
      return new Promise((resolve) => {
        //GET ACTUAL DATA HERE
        const dummyData = [
          2, 6, 61, 21, 214, 76, 342, 378, 277, 531, 183, 151, 112, 119,
        ];
        this.intensity = dummyData;
        resolve();
      });
    },
    initalizeMap() {
      function getColor(d) {
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

      function style(feature) {
        return {
          fillColor: getColor(
            tmpthis.intensity[feature.properties.regionid - 1]
          ),
          weight: 2,
          opacity: 1,
          color: "white",
          dashArray: "3",
          fillOpacity: 0.85,
        };
      }

      function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
          weight: 5,
          color: "#666",
          dashArray: "",
          fillOpacity: 0.7,
        });
        layer.bringToFront();
      }

      function resetHighlight(e) {
        geojson.resetStyle(e.target);
      }

      function click(e) {
        var regionId = e.target.feature.properties.regionid;
        tmpthis.regionClickIntensity = tmpthis.intensity[regionId - 1];
        tmpthis.regionClickName = tmpthis.idToRegion(regionId);
      }

      function onEachFeature(feature, layer) {
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: click,
        });
      }
      var tmpthis = this;
      var map = L.map("map").setView([54, -3], 6);
      var geojson;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      geojson = L.geoJson(ukdata, {
        style: style,
        onEachFeature: onEachFeature,
      }).addTo(map);

      // Icon Example
      // var dataCenterIcon = L.icon({
      //     iconUrl: dataCenterPng,
      //     iconSize: [32, 32],
      //     iconAnchor: [16,32 ]
      //   });
      // L.marker([54, -3], { icon: dataCenterIcon }).addTo(map);
    },
    idToRegion(i) {
      return i == 1
        ? "North Scotland"
        : i == 2
        ? "South Scotland"
        : i == 3
        ? "North West England"
        : i == 4
        ? "North East England"
        : i == 5
        ? "Yorkshire"
        : i == 6
        ? "North Wales"
        : i == 7
        ? "South Wales"
        : i == 8
        ? "West Midlands"
        : i == 9
        ? "East Midlands"
        : i == 10
        ? "East England"
        : i == 11
        ? "South West England"
        : i == 12
        ? "South England"
        : i == 13
        ? "London"
        : i == 14
        ? "South East England"
        : "Something went wrong!";
    },
  },
};
</script>
