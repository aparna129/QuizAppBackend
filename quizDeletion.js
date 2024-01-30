const express = require("express");
const Quizuser = require("./userModel");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.use(cors());
router.use(express.json());

router.get("/", (req, res) => {
  res.status(200).json({ message: "Deletion of Quiz Page" });
});

const isLoggedIn = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (authorization) {
      const token = authorization.split(" ")[1];
      const user = jwt.verify(token, process.env.JWT_SECRETKEY);
      if (user) {
        next();
        return;
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Token expired or invalid. Please login again to delete quiz",
    });
  }
};

router.delete("/:userId/:quizId", isLoggedIn, async (req, res) => {
  try {
    const { userId, quizId } = req.params;

    const user = await Quizuser.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const quizIndex = user.quizArray.findIndex(
      (quiz) => quiz._id.toString() === quizId
    );

    if (quizIndex === -1) {
      return res.status(400).json({ error: "Quiz doesn't exist" });
    }

    user.quizArray.splice(quizIndex, 1);
    await user.save();

    return res.status(200).json({ message: "Quiz Deleted Successfully" });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      error:
        "Cannot Delete Quiz. Something went wrong. Please try again after some time",
    });
  }
});

module.exports = router;
