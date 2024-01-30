const express = require("express");
const mongoose = require("mongoose");
const User = require("./userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const router = express.Router();

router.use(cors());

router.use(express.json());

router.get("/", (req, res) => {
  res.status(200).json({ message: "Login Page" });
});

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid Email Or User doesn't exist" });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (passwordMatched) {
      jwttoken = jwt.sign({ email }, process.env.JWT_SECRETKEY, {
        expiresIn: "48h",
      });

      return res.status(200).json({
        message: "Logged in successfully",
        jwttoken: jwttoken,
        userId: user._id,
      });
    } else {
      return res.status(400).json({ error: "Incorrect Password" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error:
        "Cannot Login.Something went wrong.Please try again after some time",
    });
  }
});

module.exports = router;
