// var express = require("express");
// var router = express.Router();
// const { MongoClient } = require("mongodb");
// require("dotenv").config();
// const URL = "mongodb://localhost:27017";
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

// router.get("/", async (req, res) => {
//   res.json({
//     message: "success",
//   });
// });

// router.post("/signup", async (req, res) => {
//   try {
//     const salt = await bcrypt.genSaltSync(10);
//     const hash = await bcrypt.hash(req.body.password, salt);
//     req.body.password = hash;

//     const connection = await MongoClient.connect(URL);
//     const db = connection.db("Authentication");

//     try {
//       const user = await db.collection("users").insertOne(req.body);
//     } catch (dbError) {
//       console.log("Database error:", dbError);
//       throw dbError;
//     }

//     await connection.close();
//     res.json({ message: "successful" });
//   } catch (error) {
//     console.log(error);
//     res.json({ message: "something went wrong" });
//   }
// });

// router.post("/login", async (req, res) => {
//   try {
//     const connection = await MongoClient.connect(URL);
//     const db = connection.db("Authentication");
//     const user = await db
//       .collection("users")
//       .findOne({ email: req.body.email });
//     if (user) {
//       const password = await bcrypt.compareSync(
//         req.body.password,
//         user.password
//       );
//       if (password) {
//         const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
//           expiresIn: "1d",
//         });

//         res.json({ message: "login sucessful", token });
//       } else {
//         res.status(404).json({ message: "passsword is incorrect" });
//       }
//     } else {
//       res.status(404).json({
//         message: "email or password is incorrect",
//       });
//     }

//     await connection.close();
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "something went wrong",
//     });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const URL = process.env.DB;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

mongoose.connect(URL);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

router.get("/", async (req, res) => {
  res.json({
    message: "success",
  });
});

router.post("/signup", async (req, res) => {
  try {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;

    const user = new User(req.body);
    await user.save();

    res.json({ message: "successful" });
  } catch (error) {
    console.log(error);
    res.json({ message: "something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const passwordMatch = await bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (passwordMatch) {
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
          expiresIn: "1d",
        });

        res.json({ message: "login successful", token });
      } else {
        res.status(404).json({ message: "password is incorrect" });
      }
    } else {
      res.status(404).json({
        message: "email or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

module.exports = router;
