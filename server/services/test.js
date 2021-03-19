const knex = require("../config/database");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/const");
var _ = require("lodash");

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getTestQuestions = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let { subjectId, length, difficulty } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);

  let questions = await knex
    .column()
    .select()
    .from("questions")
    .where("subjectId", "=", subjectId)
    .limit(length);

  let answers = await knex("answers")
    .select()
    .whereIn(
      "questionId",
      questions.map((q) => q.questionId)
    );

  let trueQuestions = new Array();

  questions.forEach((q) => {
    trueQuestions.push({
      questionId: q.questionId,
      questionString: q.questionString,
      difficultyLevel: q.difficultyLevel,
      timeAllowed: q.timeAllowed,
      answers: answers
        .filter((a) => a.questionId == q.questionId)
        .map((ans) => ({
          answerId: ans.answerId,
          answerString: ans.answerString,
        })),
    });
  });

  if (trueQuestions.length < length) {
    res.status(500).json("Not enough questions in the database!");
  } else res.json(trueQuestions);
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const submitAnswers = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let {
    answers,
    questionIds,
    difficultyLevel,
    startTime,
    totalTimeSpent,
    subjectId,
  } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);

  if (!questionIds.length) res.json("invalid request!");

  let questions = await knex
    .column()
    .select("questionId", "answerId")
    .from("questions")
    .whereIn("questionId", questionIds);

  let correctAnswerCount = 0;
  if (answers.length)
    answers.forEach((ans, index) => {
      if (
        questions.findIndex(
          (question) => question.answerId == ans.answeredKey
        ) >= 0
      )
        correctAnswerCount++;
    });

  let now = Date.now();
  let testId = `${reqUser.userId}_${parseInt((now / 1000).toFixed(0))}`;

  await knex("test_results").insert({
    testTakerId: reqUser.userId,
    startTime: startTime,
    subjectId: subjectId,
    difficultyLevel: difficultyLevel,
    totalTimeSpent: totalTimeSpent,
    questionCount: questionIds.length,
    correctAnswerCount: correctAnswerCount,
    testId: testId,
  });

  res.json(questions);
};

module.exports = {
  getTestQuestions,
  submitAnswers,
};
