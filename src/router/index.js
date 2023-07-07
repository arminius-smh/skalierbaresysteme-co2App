import { createRouter, createWebHistory } from "vue-router";
import MapView from "../views/MapView.vue";
import StatsView from "../views/StatsView.vue";
import InfoView from "../views/InfoView.vue";

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
        {
            path: "/info",
            name: "info",
            component: InfoView,
        },
    ],
});
export default router;
