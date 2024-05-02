const express = require("express");
const Quizuser = require("./userModel");
const cors = require("cors");

const router = express.Router();

router.use(cors());
router.use(express.json());

router.get("/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;

    const users = await Quizuser.find();
    let foundQuiz = null;

    for (const user of users) {
      // foundQuiz will contain either a quiz or undefined
      foundQuiz = user.quizArray.find((quiz) => quiz._id.toString() === quizId);
      if (foundQuiz) {
        break; 
      }
    }

    if (!foundQuiz) {
      return res.status(400).json({ error: "Quiz doesn't exist" });
    }

    const quizCreatedDate = new Date(foundQuiz.createdAt);
    const day = quizCreatedDate.getDate();
    const month = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(quizCreatedDate);
    const year = quizCreatedDate.getFullYear();
    const formattedDate = `${day} ${month}, ${year}`;

    return res.status(200).json({
      quiz: {
        ...foundQuiz.toObject(),
        createdAt: formattedDate,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error:
        "Cannot Get Quiz. Something went wrong. Please try again after some time",
    });
  }
});

module.exports = router;
