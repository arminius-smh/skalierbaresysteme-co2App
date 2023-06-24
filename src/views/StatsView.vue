<template>
Hello World
</template>

<script>
import { useUserStore } from "../stores/userStore.js";

export default {
  name: 'StatsView',
    setup() {
        const userStore = useUserStore();
        return { userStore };
        // userStore.getUser:
        // {
        // "_id": mongoDB unique id,
        // "name": username
        // "password": hashed password + salt
        // "profiles": [{ id: templateId, name: templateName, datacenter: [{ "regionid": regionid, "computerNum": numberofComputers, "lat": markerLat, "lang": markerLang, "marker": stored marker}]]
        //              }
        //}
    },
}
</script>
