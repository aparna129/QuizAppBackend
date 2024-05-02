const express = require("express");
const User = require("./userModel");
const bcrypt = require("bcrypt");
const cors = require("cors");

const router = express.Router();

router.use(cors());

router.use(express.json());

router.get("/", (req, res) => {
  res.status(200).json({ message: "Sign Up Page" });
});

router.post("/", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Invalid name" });
    }

    // Basic email validation 

    const emailRegex = /^[a-zA-Z0-9]+@gmail\.com$/;

    // test() method checks whether the provided string matches the regular expression pattern 

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const allUsers = await User.find();

    const existingEmails = allUsers.filter((user) => user.email === email);

    if (existingEmails.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (!password) {
      return res.status(400).json({ error: "Invalid password" });
    }

    if (password.length < 3) {
      return res
        .status(400)
        .json({ error: "Weak password,minimum length should be 3" });
    }

    if (confirmPassword !== password) {
      return res.status(400).json({ error: "Password doesn't match" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: encryptedPassword,
    });

    return res
      .status(200)
      .json({ message: "User created successfully", data: newUser });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error:
        "User cannot be created.Something went wrong.Please try again after some time",
    });
  }
});

module.exports = router;

/*

Email Regex = /^[a-zA-Z0-9]+@gmail\.com$/

The regular expression /^[a-zA-Z0-9]+@gmail.com$/ achieves the same effect, 
but it includes an escape character (\) before the dot (.). In regular expressions, 
the dot (.) has a special meaning; it matches any single character. However, when we
want to match a literal dot, such as in the domain part of an email address, we need to escape 
it with a backslash (\). So, \.com matches the literal string ".com".

*/