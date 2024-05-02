const express = require("express");
const Quizuser = require("./userModel");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.use(cors());

router.use(express.json());

router.get("/", (req, res, next) => {
  res.status(200).json({ message: "Quiz Creation Page" });
});

// Middleware for checking whether user is logged in or not

const isLoggedIn = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (authorization) {
      // Authorization contains Bearer <token> and we just want token so authorization.split(" ")[1];
      // is written which specifically extracts the token part from the Authorization.
      const token = authorization.split(" ")[1];
      const user = jwt.verify(token, process.env.JWT_SECRETKEY);
      if (user) {
        next();
        return;
      }
    }
  } catch (error) {
    next(error);
  }
};

router.post("/:userId", isLoggedIn, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Quizuser.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const { name, type, timer, impressions, questionsArray } = req.body;

    if (!name || !type || !questionsArray) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const quiz = user.quizArray.find((quiz) => quiz.name === name);

    if (quiz) {
      return res.status(400).json({ error: "Quiz already exists" });
    }

    if (questionsArray.length < 1) {
      return res.status(400).json({ error: "Minimum 1 question required" });
    }

    if (questionsArray.length > 5) {
      return res.status(400).json({ error: "Maximum only 5 questions" });
    }

    for (const question of questionsArray) {
      if (!question.question) {
        return res.status(400).json({ error: "Please type all the questions" });
      }
      question.optionValues = question.optionValues.filter(
        (option) => option.value !== null && option.value !== ""
      );

      question.optionValues = question.optionValues.filter(
        (option) => option.imageUrl !== null && option.imageUrl !== ""
      );
    }

    for (const question of questionsArray) {
      if (
        !question.question ||
        !question.optionType ||
        !question.optionValues
      ) {
        return res.status(400).json({
          error: "Each question must have optionType and optionValues.",
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

    if (type === "QnA" && !timer) {
      return res
        .status(400)
        .json({ error: "Select Timer for Q & A Questions" });
    }

    const newQuiz = {
      name,
      type,
      timer,
      impressions,
      questionsArray,
    };

    user.quizArray.push(newQuiz);

    await user.save();

    const newlyCreatedQuiz = user.quizArray[user.quizArray.length - 1];

    return res.status(200).json({
      message: "Quiz created successfully",
      data: newlyCreatedQuiz,
      id: newlyCreatedQuiz._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error:
        "Quiz cannot be created. Something went wrong. Please try again after some time",
    });
  }
});

module.exports = router;
