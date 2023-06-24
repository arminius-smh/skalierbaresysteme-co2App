import express from "express";
import users from "./routes/users.mjs";
import bodyParser from "body-parser";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import config from '../config.mjs';

const app = express();

app.use(bodyParser.json());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the /posts routes
app.use("/users", users);

// Serve the static files from the dist directory
app.use(express.static(join(__dirname, '..', 'dist')));

// Catch-all route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});
// start the Express server
app.listen(config.port, () => {
  console.log(`Server is running on port: ${config.port}`);
});
