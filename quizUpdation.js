const express = require("express");
const Quizuser = require("./userModel");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.use(cors());
router.use(express.json());

router.get("/", (req, res) => {
  res.status(200).json({ message: "Updation of Quiz Page" });
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
      error: "Token expired or invalid. Please login again to update quiz",
    });
  }
};

router.patch("/:userId/:quizId", isLoggedIn, async (req, res) => {
  try {
    const { userId, quizId } = req.params;

    const user = await Quizuser.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const { questionsArray } = req.body;

    const quizIndex = user.quizArray.findIndex(
      (quiz) => quiz._id.toString() === quizId
    );

    if (quizIndex === -1) {
      return res.status(400).json({ error: "Quiz doesn't exist" });
    }

    if (questionsArray.length < 1) {
      return res.status(400).json({ error: "Minimum 1 question required" });
    }

    for (const question of questionsArray) {
      if (
        !question.question ||
        !question.optionType ||
        !question.optionValues
      ) {
        return res.status(400).json({
          error:
            "Each question must have a question , optionType , and optionValues.",
        });
      }

      question.optionValues = question.optionValues.filter(
        (option) => option.value !== null && option.value !== ""
      );

      question.optionValues = question.optionValues.filter(
        (option) => option.imageUrl !== null && option.imageUrl !== ""
      );

      if (question.optionValues.length < 2) {
        return res
          .status(400)
          .json({ error: "Minimum 2 options required for each question" });
      }
      if (question.optionValues.length > 4) {
        return res
          .status(400)
          .json({ error: "Maximum only 4 options for each question" });
      }
    }

    user.quizArray[quizIndex].questionsArray = questionsArray;

    await user.save();

    return res.status(200).json({
      message: "Quiz Updated Successfully",
      data: user.quizArray[quizIndex],
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error:
        "Cannot Update Quiz. Something went wrong. Please try again after some time",
    });
  }
});

module.exports = router;
