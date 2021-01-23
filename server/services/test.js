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
    .leftJoin("answers", "questions.questionId", "answers.questionId")
    .limit(length * 4);

  questions = _.groupBy(questions, function (item) {
    return item.questionId;
  });
  let trueQuestions = new Array();
  for (let questionId in questions) {
    let index = questions[questionId].findIndex((q) => q.subjectId);
    trueQuestions.push({
      questionId: questions[questionId][index].questionId,
      questionString: questions[questionId][index].questionString,
      difficultyLevel: questions[questionId][index].difficultyLevel,
      timeAllowed: questions[questionId][index].timeAllowed,
      answers: questions[questionId].map((ans) => ({
        answerId: ans.answerId,
        answerString: ans.answerString,
      })),
    });
  }

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
  let { answers, questionIds } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);

  let questions = await knex
    .column()
    .select("questionId", "answerId")
    .from("questions")
    .whereIn("questionId", questionIds);

  // questions = _.groupBy(questions, function (item) {
  //   return item.questionId;
  // });
  // let trueQuestions = new Array();
  // for (let questionId in questions) {
  //   let index = questions[questionId].findIndex((q) => q.subjectId);
  //   trueQuestions.push({
  //     questionId: questions[questionId][index].questionId,
  //     questionString: questions[questionId][index].questionString,
  //     difficultyLevel: questions[questionId][index].difficultyLevel,
  //     timeAllowed: questions[questionId][index].timeAllowed,
  //     answers: questions[questionId].map((ans) => ({
  //       answerId: ans.answerId,
  //       answerString: ans.answerString,
  //     })),
  //   });
  // }

  res.json(questions);
};

module.exports = {
  getTestQuestions,
  submitAnswers,
};
