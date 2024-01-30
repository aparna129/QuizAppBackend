const mongoose = require("mongoose");

const Quizuser = mongoose.model("quizuser", {
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  quizArray: [
    {
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["QnA", "Poll Type"],
        required: true,
      },
      timer: {
        type: String,
        enum: ["OFF", "5 sec", "10 sec"],
      },
      createdAt: {
        type: Date,
        default: Date.now(),
        required: true,
      },
      impressions: {
        type: Number,
        default: 0,
        required: true,
      },
      questionsArray: [
        {
          question: {
            type: String,
            required: true,
          },
          correctAnswer: {
            type: Number,
          },
          peopleAnsweredCorrectly: {
            type: Number,
            default: 0,
          },
          peopleAnsweredIncorrectly: {
            type: Number,
            default: 0,
          },
          peopleAnsweredOption1: {
            type: Number,
            default: 0,
          },
          peopleAnsweredOption2: {
            type: Number,
            default: 0,
          },
          peopleAnsweredOption3: {
            type: Number,
            default: 0,
          },
          peopleAnsweredOption4: {
            type: Number,
            default: 0,
          },
          optionType: {
            type: String,
            enum: ["Text", "ImageUrl", "TextAndImageUrl"],
            required: true,
          },
          optionValues: [
            {
              id: {
                type: Number,
              },
              value: {
                type: String,
              },
              imageUrl: {
                type: String,
              },
            },
          ],
        },
      ],
    },
  ],
});

module.exports = Quizuser;
