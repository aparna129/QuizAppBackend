const express = require("express");
const Quizuser = require("./userModel");
const cors = require("cors");

const router = express.Router();

router.use(cors());
router.use(express.json());

router.get("/", (req, res) => {
  res.status(200).json({ message: "Questions Updation of Quiz Page" });
});

router.patch("/:quizId/:questionId", async (req, res) => {
  try {
    const { quizId, questionId } = req.params;

    const {
      peopleAnsweredCorrectly,
      peopleAnsweredIncorrectly,
      peopleAnsweredOption1,
      peopleAnsweredOption2,
      peopleAnsweredOption3,
      peopleAnsweredOption4,
    } = req.body;

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

    const currentQuestionIndex = foundQuiz.questionsArray.findIndex(
      (question) => question._id.toString() === questionId
    );

    if (currentQuestionIndex === -1) {
      return res.status(400).json({ error: "Question doesn't exist" });
    }

    const currentQuestion = foundQuiz.questionsArray[currentQuestionIndex];

    currentQuestion.peopleAnsweredCorrectly =
      currentQuestion.peopleAnsweredCorrectly +
      (isNaN(peopleAnsweredCorrectly) ? 0 : peopleAnsweredCorrectly);

    currentQuestion.peopleAnsweredIncorrectly =
      currentQuestion.peopleAnsweredIncorrectly +
      (isNaN(peopleAnsweredIncorrectly) ? 0 : peopleAnsweredIncorrectly);

    currentQuestion.peopleAnsweredOption1 =
      currentQuestion.peopleAnsweredOption1 +
      (isNaN(peopleAnsweredOption1) ? 0 : peopleAnsweredOption1);

    currentQuestion.peopleAnsweredOption2 =
      currentQuestion.peopleAnsweredOption2 +
      (isNaN(peopleAnsweredOption2) ? 0 : peopleAnsweredOption2);

    currentQuestion.peopleAnsweredOption3 =
      currentQuestion.peopleAnsweredOption3 +
      (isNaN(peopleAnsweredOption3) ? 0 : peopleAnsweredOption3);

    currentQuestion.peopleAnsweredOption4 =
      currentQuestion.peopleAnsweredOption4 +
      (isNaN(peopleAnsweredOption4) ? 0 : peopleAnsweredOption4);

    await foundUser.save();

    return res
      .status(200)
      .json({ message: "Question Updated Successfully", data: foundQuiz });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      error:
        "Cannot Update the Question. Something went wrong. Please try again after some time",
    });
  }
});

module.exports = router;
