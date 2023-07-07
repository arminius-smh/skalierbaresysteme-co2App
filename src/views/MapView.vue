<template>
  <div class="container-fluid">
  <MapOverlay
    :regionClickIntensity="regionClickIntensity"
    :regionClickName="regionClickName"
    :regionClickId="regionClickId"
    :datacenter="datacenter"
    @createDataCenter="createDataCenter"
    @updateDataCenter="updateDataCenter"
    @removeDataCenter="removeDataCenter"
  />

    <ProfileOverlay v-if="userStore.getUser != null"
      @createProfile="createProfile"
      @updateProfile="updateProfile"
      @removeProfile="removeProfile"
    />

    <miniStatsOverlay
    :datacenters="datacenter"
    :intensity="intensity" 
    />

  </div>
  <div id="map"></div>

</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet/dist/leaflet.js";
import $ from "jquery";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
import axios from "axios";
import ukdata from "../assets/ukdata.json";
import MapOverlay from "../components/MapOverlay.vue";
import miniStatsOverlay from "../components/miniStatsOverlay.vue";
import ProfileOverlay from "../components/ProfileOverlay.vue";
import dataCenterPng from "../assets/data-center-icon.png";
import { useUserStore } from "../stores/userStore.js";
import { useChosenProfileStore } from "../stores/chosenProfile.js";
import config from "../../config.mjs";

export default {
  name: "MapView",
  components: {
    miniStatsOverlay,
    MapOverlay,
    ProfileOverlay,
  },
  setup() {
    // load global variables
    const userStore = useUserStore();
    const chosenProfileStore = useChosenProfileStore();
    return { userStore, chosenProfileStore };
  },
  data() {
    return {
      intensity: [],
      regionClickIntensity: -1,
      regionClickName: "",
      regionClickId: "-1",
      map: null,
      datacenter: [],
    };
  },
  mounted() {
    // only load map after data is fetched
    this.getIntensityData()
      .then(() => {
        if (this.userStore.getUser != null) {
          this.chosenProfileStore.setProfile(this.userStore.getUser.profiles[0]); //reset to 'new template' if user switches to mapview
        }
        this.initalizeMap();
        this.resizeMap(); //resize map dynamically
      })
      .catch((error) => {
        console.log(error);
      });
  },
  watch: {
    "userStore.getUser": function () {
      // if user logs out, remove all datacenters
      if (this.userStore.getUser === null) {
        for (const singleDatacenter of this.datacenter) {
          this.map.removeLayer(singleDatacenter.marker);
        }
        this.datacenter = [];
      }
      this.resizeMap();
    },
    // remove mapicons of old profile and set mapicons of new ones
    "chosenProfileStore.getId": function () {
      for (const singleDatacenter of this.datacenter) {
        try {
          this.map.removeLayer(singleDatacenter.marker);
        } catch {}
      }
      this.datacenter = this.chosenProfileStore.getDataCenters;
      if (this.chosenProfileStore.getId != "0") {
        for (const singleDatacenter of this.datacenter) {
          try {
            // if the user didn't log out after the profiles has been created or updated, the marker's references are still saved in leaflet
            singleDatacenter.marker.addTo(this.map);
          } catch {
            // otherwise create new markers from the lat and lng
            var dataCenterIcon = L.icon({
              iconUrl: dataCenterPng,
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            });
            var lat = singleDatacenter.lat;
            var lng = singleDatacenter.lng;
            var marker = L.marker([lat, lng], {
              icon: dataCenterIcon,
            }).addTo(this.map);
            singleDatacenter.marker = marker;
          }
        }
      }
    },
  },
  methods: {
    async getIntensityData() {
      return new Promise((resolve) => {
        axios
          .get(`${config.serverURL}:${config.port}/co2data`)
          .then((response) => {
            this.intensity = response.data.flatMap((obj) =>
              obj.data.flatMap((region) =>
                region.data.flatMap((entry) => entry.intensity.forecast)
              )
            );
            resolve();
          })
          .catch((error) => {
            console.error("Error fetching co2data:", error);
          });
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

      // style every region
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
        highlightFeature(e);
        var regionId = e.target.feature.properties.regionid;
        tmpthis.regionClickIntensity = tmpthis.intensity[regionId - 1];
        tmpthis.regionClickName = tmpthis.regionIdConverter(regionId);
        tmpthis.regionClickId = regionId;
      }

      function onEachFeature(feature, layer) {
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: click,
        });
      }

      var tmpthis = this; //save reference of current scope for vue methods in current function
      this.map = L.map("map").setView([54, -3], 6);
      var geojson;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.map);

      geojson = L.geoJson(ukdata, {
        style: style,
        onEachFeature: onEachFeature,
      }).addTo(this.map);
    },
    createDataCenter(regionId, dataCenterConfig) {
      var regionId = parseInt(regionId);

      // if datacenter already exists, give no option to create another one
      if (this.datacenter.some((obj) => obj.regionId === regionId)) {
        return;
      }

      var dataCenterIcon = L.icon({
        iconUrl: dataCenterPng,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });
      var [lat, lng] = this.regionIdToCenterCoordinate(regionId);
      var marker = L.marker([lat, lng], { icon: dataCenterIcon });
      marker.addTo(this.map);
      var singleDataCenter = {
        regionId: regionId,
        marker: marker,
        lat: lat,
        lng: lng,
        computerNum: dataCenterConfig.computerNum,

      };
      this.datacenter.push(singleDataCenter);
      this.$emit("update:datacenter", this.datacenter);
    },
    removeDataCenter(regionId) {
      regionId = parseInt(regionId);
      var singleDataCenter = this.datacenter.find(
        (obj) => obj.regionId === regionId
      );
      this.datacenter = this.datacenter.filter(
        (obj) => obj.regionId !== regionId
      );
      this.map.removeLayer(singleDataCenter.marker);
      this.$emit("update:datacenter", this.datacenter);
    },
    updateDataCenter(regionId, dataCenterConfig) {
      var singleDataCenter = this.datacenter.find(
        (obj) => obj.regionId === parseInt(regionId)
      );
      singleDataCenter.computerNum = dataCenterConfig.computerNum;
      this.$emit("update:datacenter", this.datacenter);
    },
    createProfile(profileName) {
      // after new profile is created, switch to 'New Template' - so remove all current icons
      for (const singleDatacenter of this.datacenter) {
        this.map.removeLayer(singleDatacenter.marker);
      }
      var user = this.userStore.getUser;
      var modifiedDataCenters = this.datacenter.map(function (dataCenter) {
        // Create a copy of the object without the "marker" property (has circular reference)
        return {
          regionId: dataCenter.regionId,
          lat: dataCenter.lat,
          lng: dataCenter.lng,
          computerNum: dataCenter.computerNum,
        };
      });
      var profile = {
        name: profileName,
        id: user.profiles.length,
        datacenter: modifiedDataCenters,
      };
      user.profiles.push(profile);
      this.userStore.setUser(user);
      axios.put(
        `${config.serverURL}:${config.port}/users/${this.userStore.getUser._id}/profiles`,
        {
          profiles: user.profiles,
        }
      );
      this.datacenter = [];
      this.$emit("update:datacenter", this.datacenter);
    },
    updateProfile(profileName) {
      var currentProfileId = this.chosenProfileStore.getId;
      var user = this.userStore.getUser;
      var currentProfile = user.profiles.find(
        (obj) => obj.id === currentProfileId
      );

      var modifiedDataCenters = this.datacenter.map(function (dataCenter) {
        // Create a copy of the object without the "marker" property (has circular reference)
        return {
          regionId: dataCenter.regionId,
          lat: dataCenter.lat,
          lng: dataCenter.lng,
          computerNum: dataCenter.computerNum,
        };
      });
      currentProfile.name = profileName;
      currentProfile.datacenter = modifiedDataCenters;

      //update chose profile store
      this.chosenProfileStore.setName(profileName);
      this.chosenProfileStore.setDataCenter(this.datacenter);
      this.chosenProfileStore.setId(currentProfileId);
      axios.put(
        `${config.serverURL}:${config.port}/users/${this.userStore.getUser._id}/profiles`,
        {
          profiles: user.profiles,
        }
      );
    },
    removeProfile() {
      var user = this.userStore.getUser;
      user.profiles = user.profiles.filter(
        (obj) => obj.id !== this.chosenProfileStore.getId
      );
      // switch to new template after removal
      this.chosenProfileStore.setId(0);
      this.chosenProfileStore.setName("New Template");
      this.chosenProfileStore.setDataCenter([]);
      for (const singleDatacenter of this.datacenter) {
        this.map.removeLayer(singleDatacenter.marker);
      }
      this.datacenter = [];
      axios.put(
        `${config.serverURL}:${config.port}/users/${this.userStore.getUser._id}/profiles`,
        {
          profiles: user.profiles,
        }
      );
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
        return regionMap[parseInt(input)] || "Something went wrong!";
      } else {
        const invertedMap = {};
        for (const [key, value] of Object.entries(regionMap)) {
          invertedMap[value] = parseInt(key);
        }
        return invertedMap[input] || "Something went wrong!";
      }
    },
    resizeMap() {
      function resizeMapContainer() {
        var navbarHeight = $(".navbar").outerHeight();
        var mapOverlayOffset = navbarHeight + 15;
        $("#map").height(window.innerHeight - navbarHeight);
        $("#map-overlay").css("top", mapOverlayOffset + "px");
        resizeProfileOverlay();
      }
      //resize the profile overlay to fit the window when the header size
      function resizeProfileOverlay() {
        var navbarHeight = $(".navbar").outerHeight();
        var mapOverlayHeight = parseInt($("#map-overlay").css("height"));
        var profileOverlayOffset = navbarHeight + mapOverlayHeight + 30;
        $("#profile-overlay").css("top", profileOverlayOffset + "px");
      }

      // Resize the map container to fit the window when the header size changes
      new ResizeSensor($(".navbar"), function () {
        resizeMapContainer();
      });
      // Resize the 'profile overlay' whenever the 'map overlay' size changes
      new ResizeSensor($("#map-overlay"), function () {
        resizeProfileOverlay();
      });

      // resize everything accordingly, whenever the window gets resized
      window.addEventListener("resize", function () {
        resizeMapContainer();
      });

      // initial resize
      resizeMapContainer();
    },
    // get coordinates of middle of region for icon placement
    regionIdToCenterCoordinate(regionId) {
      const regionMap = {
        1: [56.8, -4.1],
        2: [55.5, -3.6],
        3: [54.3, -2.9],
        4: [54.7, -1.9],
        5: [53.5, -1.2],
        6: [52.8, -3.6],
        7: [51.8, -3.8],
        8: [52.2, -2.3],
        9: [52.6, -1.0],
        10: [52.1, 0.6],
        11: [50.6, -3.8],
        12: [51.2, -1.5],
        13: [51.4, 0.0],
        14: [50.9, 0.3],
      };
      return regionMap[regionId];
    },
  },
};
</script>
