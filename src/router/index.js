import { createRouter, createWebHistory } from "vue-router";
import MapView from "../views/MapView.vue";
import StatsView from "../views/StatsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: MapView,
    },
    {
        path: "/stats",
        name: "stats",
        component: StatsView,
        },
  ],
});
export default router;
