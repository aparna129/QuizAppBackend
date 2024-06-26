const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const signUpRoute = require("./signUp");
const loginRoute = require("./login");
const quizCreationRoute = require("./quizCreation");
const quizUpdationRoute = require("./quizUpdation");
const quizDeletionRoute = require("./quizDeletion");
const getAllQuizzesRoute = require("./getAllQuizzes");
const getQuizByIdRoute = require("./getQuizById");
const questionUpdationRoute = require("./questionsUpdation");
const impressionsUpdationRoute = require("./impressionsUpdation");

const app = express();

app.use("/signup", signUpRoute);
app.use("/login", loginRoute);
app.use("/quizCreation", quizCreationRoute);
app.use("/quizUpdation", quizUpdationRoute);
app.use("/quizDeletion", quizDeletionRoute);
app.use("/getAllQuizzes", getAllQuizzesRoute);
app.use("/getQuizById", getQuizByIdRoute);
app.use("/questionsUpdation", questionUpdationRoute);
app.use("/impressionsUpdation", impressionsUpdationRoute);

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Quiz App" });
});

// Route not found middleware

app.use((req, res) => {
  res.status(200).json({ error: "Route not found" });
});

app.use((req,res,next,error)=>{
  console.log(error);
  res.status(400).json({
    error: "Token expired or invalid. Please login again to create quiz",
  });
})

app.listen(PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Server and Database connected successfully"))
    .catch((error) => console.log(error));
});
