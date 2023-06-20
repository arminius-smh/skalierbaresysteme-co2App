<template>
    <Header></Header>
    <MapOverlay :regionClickIntensity="regionClickIntensity" :regionClickName="regionClickName"
        :regionClickId="regionClickId" :datacenter="datacenter" @createDataCenter="createDataCenter"
        @updateDataCenter="updateDataCenter" @removeDataCenter="removeDataCenter" />
    <div id="map"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet/dist/leaflet.js";
import $ from "jquery";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
import ukdata from "../assets/ukdata.json";
import MapOverlay from "../components/MapOverlay.vue";
import Header from "../components/Header.vue";
import dataCenterPng from "../assets/data-center-icon.png";

export default {
    name: "MapView",
    components: {
        MapOverlay,
        Header,
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
        this.getIntensityData()
            .then(() => {
                this.initalizeMap();
            })
            .catch((error) => {
                console.log(error);
            });

        this.resizeMap()
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
            var tmpthis = this;
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
                computerNum: dataCenterConfig.computerNum,
            };
            this.datacenter.push(singleDataCenter);
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
        },
        updateDataCenter(regionId, dataCenterConfig) {
            var singleDataCenter = this.datacenter.find(
                (obj) => obj.regionId === parseInt(regionId)
            );
            singleDataCenter.computerNum = dataCenterConfig.computerNum;
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
        // Resize the map container to fit the window when the header size changes
        function resizeMapContainer() {
            var navbarHeight = $(".navbar").outerHeight();
            var overlayOffset = navbarHeight + 15;
            $("#map").height(window.innerHeight - navbarHeight);
            $("#overlay").css("top", overlayOffset + "px");
        }
        new ResizeSensor($(".navbar"), function () {
            resizeMapContainer();
        });
        },
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
