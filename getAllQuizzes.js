const express = require("express");
const router = express.Router();
const Quizuser = require("./userModel");
const cors = require("cors");
const jwt = require("jsonwebtoken");

router.use(cors());

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
    res.status(400).json({
      error: "Token expired or invalid. Please login again",
    });
  }
};

router.get("/:userId", isLoggedIn, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Quizuser.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const allQuizzes = user.quizArray;

    const impressionsSortedQuizzes = allQuizzes
      .slice()
      .sort((a, b) => b.impressions - a.impressions);

    const dateSortedQuizzes = allQuizzes
      .slice()
      .sort((a, b) => a.createdAt - b.createdAt);

    const totalQuizzes = allQuizzes.length;

    let totalQuestions = 0;

    let totalImpressions = 0;

    for (const quiz of allQuizzes) {
      totalQuestions += quiz.questionsArray.length;
      totalImpressions += quiz.impressions;
    }

    const formattedImpressionsSortedQuizzes = impressionsSortedQuizzes.map(
      (quiz) => {
        const quizCreatedDate = new Date(quiz.createdAt);

        const day = quizCreatedDate.getDate();
        const month = new Intl.DateTimeFormat("en-US", {
          month: "short",
        }).format(quizCreatedDate);
        const year = quizCreatedDate.getFullYear();

        const formattedDate = `${day} ${month}, ${year}`;

        return {
          ...quiz.toObject(),
          createdAt: formattedDate,
        };
      }
    );

    const formattedDateSortedQuizzes = dateSortedQuizzes.map((quiz) => {
      const quizCreatedDate = new Date(quiz.createdAt);

      const day = quizCreatedDate.getDate();
      const month = new Intl.DateTimeFormat("en-US", {
        month: "short",
      }).format(quizCreatedDate);
      const year = quizCreatedDate.getFullYear();

      const formattedDate = `${day} ${month}, ${year}`;

      return {
        ...quiz.toObject(),
        createdAt: formattedDate,
      };
    });
    res.status(200).json({
      totalQuizzes: totalQuizzes,
      totalQuestions: totalQuestions,
      totalImpressions: totalImpressions,
      impressionsSortedQuizzes: formattedImpressionsSortedQuizzes,
      dateSortedQuizzes: formattedDateSortedQuizzes,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Cannot get all Quizzes",
    });
  }
});

module.exports = router;
