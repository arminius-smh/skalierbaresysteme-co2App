import axios from "axios";
import express from "express";

var co2data = [];
var tempco2data = []; //make sure that co2data isn't empty or partially filled when calling the endpoint

async function fetchData() {
  tempco2data = [];
  try {
    for (let i = 1; i <= 14; i++) {
      const response = await axios.get(
        `https://api.carbonintensity.org.uk/regional/regionid/${i}`
      );
      tempco2data.push(response.data);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  co2data = [ ...tempco2data]; // copy tempco2data to co2data, so that co2data is never empty or partially filled
}

await fetchData(); //initial fetch
setInterval(fetchData, 1800000); //every 30min

const router = express.Router();

router.get("/", (req, res) => {
  res.send(co2data).status(200);
});

export default router;
