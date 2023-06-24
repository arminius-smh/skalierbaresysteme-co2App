import { defineStore } from "pinia";

export const useChosenProfileStore = defineStore("chosenProfile", {
    state: () => ({ id: 0, name: "", datacenter: [] }),
    getters: {
        getId: (state) => state.id,
        getDataCenters: (state) => state.datacenter,
        getName: (state) => state.name,
    },
    actions: {
        setDataCenter(datacenter) {
            this.datacenter = datacenter;
        },
        setId(id) {
            this.id = id;
        },
        setName(name) {
            this.name = name;
        },
        setProfile(profile) {
            this.id = profile.id;
            this.name = profile.name;
            this.datacenter = profile.datacenter;
        }
    },
});
