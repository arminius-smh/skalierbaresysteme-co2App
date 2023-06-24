<template>
    <div id="profile-overlay">
        <h4>Profile: {{ this.chosenProfileStore.getName }}</h4>
        <p><u>Profile Name:</u></p>
            <input
              type="profileName"
              id="profileName"
              v-model="profileName"
              required
              class="input-field"
              />
        <div v-if="chosenProfileStore.getId === 0" class="newTemplate">
            <button id="create-button" @click="createProfile">Create</button>
        </div>
        <div v-else>
            <button id="update-button" @click="updateProfile" style="margin-right: 10px">Update</button>
            <button id="remove-button" @click="removeProfile">Remove</button>
        </div>
        <div :class="['popup-container', { 'popup-open': notifyCreate }]">
            <div class="popup-content">
                Succesfully created profile: {{ this.profileNameTemp }}
            </div>
        </div>
        <div :class="['popup-container', { 'popup-open': notifyUpdate }]">
            <div class="popup-content">
                Succesfully updated profile: {{ this.profileNameTemp }}
            </div>
        </div>

        <div :class="['popup-container', { 'popup-open': notifyError }]">
            <div class="popup-content">
                Sorry, something went wrong!
            </div>
        </div>
    </div>


</template>

<style scoped>
.newTemplate {
    display: flex;
    flex-direction: column;
}
    .input-field {
  margin-bottom: 10px;
}
</style>

<script>
import { useUserStore } from "../stores/userStore.js";
import { useChosenProfileStore } from "../stores/chosenProfile.js";

export default {
    setup() {
        const userStore = useUserStore();
        const chosenProfileStore = useChosenProfileStore();
        return { userStore, chosenProfileStore };
    },
    data() {
        return {
            profileName: "",
            profileNameTemp: "",
            notifyCreate: false,
            notifyUpdate: false,
            notifyError: false,
        };
    },
    watch: {
        'chosenProfileStore.getId': function() {
            if (this.chosenProfileStore.getId === 0) {
                this.profileName = "";
            } else {
                this.profileName = this.chosenProfileStore.getName;
            }
        },
        'chosenProfileStore.getName': function() {
            if (this.chosenProfileStore.getId === 0) {
                this.profileName = "";
            } else {
                this.profileName = this.chosenProfileStore.getName;
            }
        }
    },
    methods: {
        createProfile() {
            // check if profile already exists
            if (this.userStore.getUser.profiles.some((obj) => obj.name === this.profileName)) {
                this.notifyError = true;
                setTimeout(() => {
                    this.notifyError = false;
                }, 2000);
                return;
            }
            // check if profile name is empty
            if (this.profileName === "") {
                this.notifyError = true;
                setTimeout(() => {
                    this.notifyError = false;
                }, 2000);
                return;
            }
            this.$emit("createProfile", this.profileName);
            this.profileNameTemp = this.profileName;
            this.notifyCreate = true;
            setTimeout(() => {
                this.notifyCreate = false;
            }, 2000);
            if (this.chosenProfileStore.getId === 0) {
                this.profileName = "";
            }
        },
        removeProfile() {
            this.$emit("removeProfile");
            this.profileName = "";
        },
        updateProfile() {
            // check if profile name is empty
            if (this.profileName === "") {
                this.notifyError = true;
                setTimeout(() => {
                    this.notifyError = false;
                }, 2000);
                return;
            }
            this.$emit("updateProfile", this.profileName);
            this.profileNameTemp = this.profileName;
            this.notifyUpdate = true;
            setTimeout(() => {
                this.notifyUpdate = false;
            }, 2000);
            
        },
    },
};
</script>
