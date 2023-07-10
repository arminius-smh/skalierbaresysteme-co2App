<template>
  <div id="SignInOverlay">
    <div class="overlay">
      <div class="overlay-content">
        <button
          class="close-button"
          @click="this.$emit('closeSignIn')"
        ></button>
        <h2 class="app-name">CO2 App UK</h2>
        <form @submit.prevent="signIn" class="login-form">
          <div class="form-group">
            <label for="Username">Username:</label>
            <input
              type="username"
              id="username"
              v-model="username"
              required
              class="input-field"
            />
          </div>

          <div class="form-group">
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              class="input-field"
            />
          </div>
          <div class="error hidden error-login my-4">
            Something went wrong. Please try again.
          </div>
          <button type="submit" class="submit-btn">Sign In</button>
          <p class="register-link" @click="showRegisterOverlayFunc">Register</p>
        </form>
      </div>
    </div>

    <div v-if="showRegisterOverlay" class="overlay">
      <div class="overlay-content-signin">
        <button
          class="close-button"
          @click="this.showRegisterOverlay = false"
        ></button>
        <h2 class="app-name">CO2 App UK</h2>
        <form @submit.prevent="register" class="register-form">
          <div class="form-group">
            <label for="username">Username:</label>
            <input
              type="Username"
              id="username"
              v-model="registerUsername"
              required
              class="input-field"
            />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              v-model="registerPassword"
              required
              class="input-field"
            />
          </div>

          <div class="error hidden error-register my-4">
            Something went wrong. Please try again.
          </div>
          <div class="success hidden success-register my-4">
            Successfully registered. Please sign in.
          </div>
          <button type="submit" class="submit-btn">Register</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from '../stores/userStore.js'
import config from "../../config.mjs";

export default {
    setup() {
        // load global variables
        const store = useUserStore()
        return { store }
    },
    data() {
        return {
            showRegisterOverlay: false,
            username: "",
            password: "",
            registerUsername: "",
            registerPassword: "",
        };
    },
    methods: {
        showRegisterOverlayFunc() {
            this.showRegisterOverlay = true;
        },
        signIn() {
            axios
                .post(`${config.serverURL}:${config.port}/users/login`, {
                    name: this.username,
                    password: this.password,
                })
                .then((response) => {
                    this.store.setUser(response.data.user)
                    this.$emit("LoggedIn");
                    return;
                })
                .catch((error) => {
                    this.showError("error-login");
                });

            // Reset form fields
            this.username = "";
            this.password = "";
        },
        register() {
            axios
                .post(`${config.serverURL}:${config.port}/users/register`, {
                    name: this.registerUsername,
                    password: this.registerPassword,
                })
                .then((response) => {
                    this.showSuccess("success-register");
                })
                .catch((error) => {
                    this.showError("error-register");
                    console.log(error);
                });

            // Reset form fields
            this.registerUsername = "";
            this.registerPassword = "";
        },
        showError(errorClass) {
            const errorElement = document.querySelector(`.${errorClass}`);
            if (errorElement) {
                errorElement.classList.remove("hidden");
            }
        },
        showSuccess(succClass) {
            const succElement = document.querySelector(`.${succClass}`);
            if (succElement) {
                succElement.classList.remove("hidden");
            }
        },
    },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.overlay-content-signin,
.overlay-content {
  position: relative;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.overlay-content-signin {
  top: 50px;
  left: 3vw;
}

.app-name {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.label {
  margin-bottom: 5px;
  font-weight: bold;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error {
  color: red;
  margin-top: 5px;
  font-size: 12px;
}

.error.hidden {
  display: none;
}

.success {
  color: green;
  margin-top: 5px;
  font-size: 12px;
}

.success.hidden {
  display: none;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.forgot-password,
.register-link {
  margin-top: 10px;
  font-size: 14px;
  color: #007bff;
  cursor: pointer;
}

.submit-btn {
  padding: 10px 40px;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.register-link {
  margin-top: 20px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 16px;
  padding: 3px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #000;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #808080;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: content-box;
}

.close-button::before,
.close-button::after {
  content: "";
  position: absolute;
  width: 14px;
  height: 2px;
  background-color: #808080;
}

.close-button::before {
  transform: rotate(45deg);
}

.close-button::after {
  transform: rotate(-45deg);
}
</style>
