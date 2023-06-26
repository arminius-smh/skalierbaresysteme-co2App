import { MongoClient } from "mongodb";
import config from "../../config.mjs";

const client = new MongoClient(config.dbURL);

let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db("co2uk");

export default db;
