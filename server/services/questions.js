const knex = require("../config/database");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/const");

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const proposeQuestion = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let {
    questionString,
    answer1,
    answer2,
    answer3,
    answer4,
    topicId,
    difficultyLevel,
    allowedTime,
  } = req.body;
  let now = Date.now();
  let questionId = parseInt((now / 1000).toFixed(0));
  answer1.id = now;
  answer2.id = now + 1;
  answer3.id = now + 2;
  answer4.id = now + 3;
  let answers = [answer1, answer2, answer3, answer4];
  let correctAnswerId = answers.find((answer) => answer.isCorrect).id;
  let reqUser = jwt.verify(token, jwtSecret);
  let isPassedPreliminaryReview = reqUser.role != 3 ? 1 : 0;
  let addedQuestion = await knex("questions").returning("*").insert({
    questionString: questionString,
    answerId: correctAnswerId,
    subjectId: topicId,
    questionId: questionId,
    creatorId: reqUser.userId,
    difficultyLevel: difficultyLevel,
    timeAllowed: allowedTime,
    passedPreliminaryReview: isPassedPreliminaryReview,
    passedFinalReview: 0,
  });
  let addedAnswers = [];
  let insertAnswers = new Promise((resolve, reject) => {
    answers.forEach(async (answer, index, arr) => {
      let ans = await knex("answers").returning("*").insert({
        questionId: questionId,
        answerId: answer.id,
        answerString: answer.string,
      });
      addedAnswers.push(ans[0]);
      if (index === arr.length - 1) resolve();
    });
  });

  insertAnswers.then(() => {
    res.json({ addedQuestion: addedQuestion[0], addedAnswers: addedAnswers });
  });
};

module.exports = {
  proposeQuestion,
};
