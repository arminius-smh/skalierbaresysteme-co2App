import express from "express";
import users from "./routes/users.mjs";
import co2data from "./routes/co2data.mjs";
import bodyParser from "body-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import config from "../config.mjs";
import https from "https";
import http from "http";
import fs from "mz/fs.js";

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

// route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "..", "dist", "index.html"));
});

// start the server on https is configured, fall back to http
if (config.useHttps) {
  const { key, cert } = await (async () => {
    return {
      key: await fs.readFile(`/app/privkey.pem`),
      cert: await fs.readFile(`/app/fullchain.pem`),
    };
  })();
  const httpsServer = https
    .createServer({ key, cert }, app)
    .listen(config.port, () => {
      console.log(`HTTPS server is running on port: ${config.port}`);
    });
} else {
  const httpServer = http.createServer(app).listen(config.port, () => {
    console.log(`HTTP server is running on port: ${config.port}`);
  });
}
