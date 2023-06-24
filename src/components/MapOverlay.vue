<template>
    <div id="map-overlay">
        <div v-if="regionClickName === ''">
            <h4>Please click on a region</h4>
        </div>
        <div v-else>
            <h4>Region: {{ regionClickName }}</h4>
            <p><u>Choose your configuration</u></p>
            <p>Number of computers</p>
            <input type="range" min="1" max="50" step="1" v-model="ComputerNum" @input="calculateCarbonIntensity" />
            <div class="slider-value">{{ ComputerNum }}</div>
            <p><u>Calculated Carbon Intensity</u></p>
            <p>{{ calculatedCarbonIntensity }} kg CO2 / kWh</p>
            <div v-if="datacenter.some((obj) => obj.regionId === parseInt(regionClickId))
                ">
                <button id="update-button" @click="updateDataCenter" style="margin-right: 10px">
                    Update
                </button>
                <button id="remove-button" @click="removeDataCenter">Remove</button>
            </div>
            <div v-else>
                <button id="create-button" @click="createDataCenter">Create</button>
            </div>
        </div>

        <div :class="['popup-container', { 'popup-open': notifyUpdate }]">
            <div class="popup-content">
                Updated Number of Computers to {{ SavedComputerNum }}
            </div>
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
        regionClickId: {
            type: String,
        },
        regionClickName: {
            type: String,
        },
        datacenter: {
            type: Array,
        },
    },
    data() {
        return {
            ComputerNum: 1,
            calculatedCarbonIntensity: 0,
            notifyUpdate: false,
            SavedComputerNum: 0,
            dataCenterConfig: [],
        };
    },
    watch: {
        regionClickIntensity() {
            this.calculateCarbonIntensity();
        },
        regionClickId() {
            if (
                this.datacenter.some(
                    (obj) => obj.regionId === parseInt(this.regionClickId)
                )
            ) {
                this.ComputerNum = this.datacenter.find(
                    (obj) => obj.regionId === parseInt(this.regionClickId)
                ).computerNum;
            } else {
                this.ComputerNum = 1;
            }
        },
    },
    methods: {
        calculateCarbonIntensity() {
            this.calculatedCarbonIntensity =
                // TODO: Which numbers to use?
                ((this.regionClickIntensity * this.ComputerNum * 3) / 1000).toFixed(2);
        },
        createDataCenter() {
            this.dataCenterConfig = {
                computerNum: this.ComputerNum,
            };
            this.$emit("createDataCenter", this.regionClickId, this.dataCenterConfig);
        },
        updateDataCenter() {
            this.dataCenterConfig = {
                computerNum: this.ComputerNum,
            };
            this.$emit("updateDataCenter", this.regionClickId, this.dataCenterConfig);
            this.SavedComputerNum = this.ComputerNum;
            this.notifyUpdate = true;
            setTimeout(() => {
                this.notifyUpdate = false;
            }, 2000);
        },
        removeDataCenter() {
            this.$emit("removeDataCenter", this.regionClickId);
        },
    },
};
</script>
