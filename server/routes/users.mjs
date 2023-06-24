import express from "express";
import db from "../db/conn.mjs";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";;

const router = express.Router();

router.get("/", async (req, res) => {
  let collection = db.collection("users");
  let results = await collection.find({}).toArray();

  res.send(results).status(200);
});

router.post("/register", async (req, res) => {
  try {
    let collection = db.collection("users");
    const hashedPassword = await bcrypt.hash(req.body.password, 10);


    // Check if the user already exists
    let existingUser = await collection.findOne({ name: req.body.name });
    if (existingUser) {
      return res.status(409).send("User already exists");
    }

        const newUser = { name: req.body.name, password: hashedPassword, profiles: [{id: 0, name: "New Template", datacenter:[]}] };

    let result = await collection.insertOne(newUser);
    res.send(result).status(204);
  } catch {
    res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  let collection = db.collection("users");
  let user = await collection.find({ name: req.body.name }).toArray();
  if (user.length == 0) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user[0].password)) {
      res.send({message: "Success", user: user[0]});
    } else {
      res.status(401).send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

router.put('/:userId/profiles', async (req, res) => {
  const collection = db.collection("users");
  const userId = req.params.userId;
  const newProfile = req.body.profiles;

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { profiles: newProfile } }
    );

    if (result.modifiedCount === 1) {
      res.status(200).send();
    } else {
      res.status(404).send('User not found or no changes made');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

export default router;
