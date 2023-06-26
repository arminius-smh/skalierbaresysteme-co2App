import express from "express";
import users from "./routes/users.mjs";
import co2data from "./routes/co2data.mjs";
import bodyParser from "body-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import config from "../config.mjs";

const app = express();

app.use(bodyParser.json());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the /users routes
app.use("/users", users);

// Load the /co2data routes
app.use("/co2data", co2data);

// Serve the static files from the dist directory
app.use(express.static(join(__dirname, "..", "dist")));

// Catch-all route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "..", "dist", "index.html"));
});
// start the Express server
app.listen(config.port, () => {
  console.log(`Server is running on port: ${config.port}`);
});
