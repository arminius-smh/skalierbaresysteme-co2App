<template>
  <nav
    v-if="!isLoggedIn()"
    class="navbar navbar-expand-lg navbar-light bg-light"
  >
    <div class="container-fluid">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="navbar-brand" href="#">CO<sub>2</sub> App</a>
        </li>

        <li class="nav-item">
          <button
            class="btn btn-outline-success"
            type="button"
            aria-current="page"
            @click="showSignInOverlay = true"
          >
            Log In
          </button>
        </li>
        <li class="nav-item active">
          <router-link class="nav-link" to="/">Map</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/info">Info</router-link>
        </li>
      </ul>
    </div>
  </nav>

  <nav v-else class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">CO<sub>2</sub> App</a>
      <div class="navbar-brand">
        Wilkommen <i>{{ this.user_name }} </i> !
      </div>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <button
              type="button"
              class="btn btn-outline-danger"
              aria-current="page"
              @click="logout()"
            >
              Logout
            </button>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Profiles
            </a>
            <ul class="dropdown-menu">
              <li v-for="profile in profiles">
                <a class="dropdown-item" @click="setProfile(profile)">{{
                  profile.name
                }}</a>
              </li>
            </ul>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Map</router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/stats">Stats</router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/info">Info</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div v-if="this.showSignInOverlay">
    <SignInOverlay @closeSignIn="closeSignIn" @LoggedIn="LoggedIn" />
  </div>
</template>

<script>
import SignInOverlay from "./SignInOverlay.vue";
import { useUserStore } from "../stores/userStore.js";
import { useChosenProfileStore } from "../stores/chosenProfile.js";

export default {
  name: "Header",
  components: {
    SignInOverlay,
  },
  setup() {
    // load global variables
    const userStore = useUserStore();
    const chosenProfileStore = useChosenProfileStore();
    return { userStore, chosenProfileStore };
  },
  data() {
    return {
      user_name: "",
      profiles: [],
      showSignInOverlay: false,
    };
  },
  watch: {
    // if the global profiles change, update the locally displayed profiles
    "userStore.getUser.profiles": function () {
      if (this.userStore.getUser != null) {
        this.profiles = this.userStore.getUser.profiles;
      }
    },
  },
  methods: {
    closeSignIn() {
      this.showSignInOverlay = false;
    },
    isLoggedIn() {
      return this.userStore.getUser != null;
    },
    setProfile(profile) {
      // profile.id = 0 is the 'new Template' profile
      if (profile.id === 0) {
        profile.datacenter = [];
      }
      this.chosenProfileStore.setProfile(profile);
    },
    LoggedIn() {
      this.closeSignIn();
      this.user_name = this.userStore.getUser.name;
      this.profiles = this.userStore.getUser.profiles;
      this.setProfile(this.profiles[0]);
    },
    logout() {
      this.userStore.setUser(null);
    },
  },
};
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5em;
}
</style>
