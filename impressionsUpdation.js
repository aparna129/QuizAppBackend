const express = require("express");
const Quizuser = require("./userModel");
const cors = require("cors");

const router = express.Router();

router.use(cors());

router.use(express.json());

router.get("/", (req, res) => {
  res.status(200).json({ message: "Impressions Updation Page" });
});

router.patch("/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const { impressions } = req.body;

    const users = await Quizuser.find();
    let foundQuiz = null;
    let foundUser = null;

    for (const user of users) {
      foundQuiz = user.quizArray.find((quiz) => quiz._id.toString() === quizId);
      if (foundQuiz) {
        foundUser = user;
        break;
      }
    }

    if (!foundQuiz) {
      return res.status(400).json({ error: "Quiz doesn't exist" });
    }

    foundQuiz.impressions = foundQuiz.impressions + impressions;

    await foundUser.save(); 

    return res
      .status(200)
      .json({ message: "Impressions Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error:
        "Cannot Update Impressions. Something went wrong. Please try again after some time",
    });
  }
});

module.exports = router;
