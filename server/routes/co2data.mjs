import axios from "axios";
import express from "express";
import { DateTime } from "luxon";

var co2data = [];
var co2data24h = [];
var co2data48h = [];

// carbon intensity requires the date in ISO8601 format
function getCurrentDateTimeUK() {
  // Get the current date and time in the UK timezone (Europe/London)
  const currentDateTime = DateTime.local().setZone('Europe/London');

  // Format the date and time in ISO 8601 format
  const formattedDateTime = currentDateTime.toFormat('yyyy-MM-dd\'T\'HH:mm\'Z\'');

  return formattedDateTime;
}

async function fetchData() {
    console.log("Fetching data...");
    var tempco2data = []; //make sure that co2data isn't empty or partially filled when calling the endpoint
    var tempco2data24h = [];
    var tempco2data48h = [];
    const currentDateTime = getCurrentDateTimeUK();
    try {
        for (let i = 1; i <= 14; i++) {
            //returns array of predictions for the next 48h in 30min time slices
            const response = await axios.get(
                `https://api.carbonintensity.org.uk/regional/intensity/${currentDateTime}/fw48h/regionid/${i}`
            );
            const allpredictions = response.data["data"]["data"];
            tempco2data.push(allpredictions[0]); // first entry is current time
            tempco2data24h.push(allpredictions[47]); // every 30min, so 48h = 96 entries (half is 48 -> 47)
            tempco2data48h.push(allpredictions[allpredictions.length - 1]); // last entry is 48h forwad
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    co2data = [...tempco2data]; // copy tempco2data to co2data, so that co2data is never empty or partially filled
    co2data24h = [...tempco2data24h];
    co2data48h = [...tempco2data48h];
    console.log("Data fetched!");
}

await fetchData(); //initial fetch
setInterval(fetchData, 1800000); //every 30min

const router = express.Router();

router.get("/", (req, res) => {
    res.send(co2data).status(200);
});
router.get("/fw24h", (req, res) => {
    res.send(co2data24h).status(200);
});
router.get("/fw48h", (req, res) => {
    res.send(co2data48h).status(200);
});

export default router;
