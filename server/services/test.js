const knex = require("../config/database");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/const");
const moment = require("moment");
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

  let difficultyLevels =
    difficulty == "easy"
      ? [1, 2, 3]
      : difficulty == "medium"
      ? [4, 5, 6]
      : [7, 8, 9];

  let questions = await knex
    .column()
    .select()
    .from("questions")
    .where("subjectId", "=", subjectId)
    .whereIn("difficultyLevel", difficultyLevels)
    .orderBy(knex.raw("RANDOM()"))
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
const getRatedQuestion = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let { subjectId } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);

  let originalRating = await knex("ratings")
    .select()
    .where("userId", "=", reqUser.userId)
    .where("subjectId", "=", subjectId);

  if (originalRating.length) originalRating = originalRating[0].rating;
  else originalRating = 3;

  originalRating = Math.round(originalRating);

  if (originalRating < 1) originalRating = 1;
  else if (originalRating > 9) originalRating = 9;

  let question = await knex
    .column()
    .select()
    .from("questions")
    .where("subjectId", "=", subjectId)
    .where("difficultyLevel", "=", originalRating)
    .orderBy(knex.raw("RANDOM()"))
    .limit(1);

  question = question[0];

  let answers = await knex("answers")
    .select()
    .where("questionId", "=", question.questionId);

  answers.questionId = undefined;

  let trueQuestion = {
    questionId: question.questionId,
    questionString: question.questionString,
    difficultyLevel: question.difficultyLevel,
    timeAllowed: question.timeAllowed,
    answers: answers,
  };

  res.json(trueQuestion);
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getRating = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let { subjectId } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);

  let originalRating = await knex("ratings")
    .select()
    .where("userId", "=", reqUser.userId)
    .where("subjectId", "=", subjectId);

  if (originalRating.length) originalRating = originalRating[0].rating;
  else originalRating = 3;

  res.json(originalRating);
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
    .select("questionId", "answerId", "difficultyLevel")
    .from("questions")
    .whereIn("questionId", questionIds);

  // let originalRating = await knex("ratings")
  //   .select()
  //   .where("userId", "=", reqUser.userId)
  //   .where("subjectId", "=", subjectId);

  // if (originalRating.length) originalRating = originalRating[0].rating;
  // else originalRating = 3;

  // let curRating = _.clone(originalRating);

  // const powerConstant = 10 / 7;
  // const k = 0.2;
  // let expectedProbability = (currentRating, questionRating) =>
  //   (1.0 * 1.0) /
  //   (1 +
  //     1.0 *
  //       Math.pow(10, (1.0 * (questionRating - currentRating)) / powerConstant));

  // let newRating = (currentRating, actualResult, expectedResult) =>
  //   currentRating + k * (actualResult - expectedResult);

  // questions.forEach((q) => {
  //   let expectedProb = expectedProbability(originalRating, q.difficultyLevel);
  //   let actualRes =
  //     answers.findIndex((a) => a.answeredKey == q.answerId) >= 0 ? 1 : 0;
  //   curRating = newRating(curRating, actualRes, expectedProb);
  //   if (curRating < 0) curRating = 0;
  // });

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

  // await knex("ratings")
  //   .insert({
  //     userId: reqUser.userId,
  //     subjectId: subjectId,
  //     rating: curRating,
  //     lastUpdate: moment(),
  //   })
  //   .onConflict(["userId", "subjectId"])
  //   .merge();

  res.json(questions);
};

module.exports = {
  getTestQuestions,
  submitAnswers,
  getRatedQuestion,
  getRating,
};
