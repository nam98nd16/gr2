const knex = require("../config/database");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/const");
var _ = require("lodash");

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
    passedPeerReview: 0,
    hasBeenReported: 0,
    hasBeenAssigned: 0,
    hasBeenRejected: 0,
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

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getAllQuestions = async (req, res) => {
  let questions = await knex
    .column()
    .select()
    .from("questions")
    .joinRaw("natural full join answers");

  let peerReviewResults = await knex
    .column()
    .select()
    .from("peer_review_results");

  questions = _.groupBy(questions, function (item) {
    return item.questionId;
  });
  let trueQuestions = new Array();
  for (let questionId in questions) {
    let index = questions[questionId].findIndex((q) => q.subjectId);
    trueQuestions.push({
      questionId: questions[questionId][index].questionId,
      subjectId: questions[questionId][index].subjectId,
      answerId: questions[questionId][index].answerId,
      questionString: questions[questionId][index].questionString,
      creatorId: questions[questionId][index].creatorId,
      difficultyLevel: questions[questionId][index].difficultyLevel,
      timeAllowed: questions[questionId][index].timeAllowed,
      passedPreliminaryReview:
        questions[questionId][index].passedPreliminaryReview,
      passedFinalReview: questions[questionId][index].passedFinalReview,
      passedPeerReview: questions[questionId][index].passedPeerReview,
      hasBeenReported: questions[questionId][index].hasBeenReported,
      hasBeenAssigned: questions[questionId][index].hasBeenAssigned,
      hasBeenRejected: questions[questionId][index].hasBeenRejected,
      answers: questions[questionId].map((ans) => ({
        answerId: ans.answerId,
        answerString: ans.answerString,
        isCorrect: ans.answerId == questions[questionId][index].answerId,
      })),
    });
  }

  let assignees = _.groupBy(peerReviewResults, function (item) {
    return item.questionId;
  });

  for (let questionId in assignees) {
    let questionIndex = trueQuestions.findIndex(
      (question) => question.questionId == questionId
    );
    trueQuestions[questionIndex].assignees = assignees[
      questionId
    ].map((assignee) => ({ ...assignee, questionId: undefined }));
  }

  res.json(trueQuestions);
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const approveQuestion = async (req, res) => {
  let {
    isForPreliminaryReview,
    isForPeerReview,
    isForFinalReview,
    questionId,
  } = req.body;
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let reqUser = jwt.verify(token, jwtSecret);
  if (isForPreliminaryReview) {
    await knex("questions")
      .where("questionId", "=", questionId)
      .update("passedPreliminaryReview", 1);
    res.json("success");
  }
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getAvailableAssignees = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let reqUser = jwt.verify(token, jwtSecret);
  let assignees = await knex()
    .select("username", "userId", "role", "subjectId")
    .from("accounts")
    .where("subjectId", "=", reqUser.subjectId);
  res.json(assignees);
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const setAssignees = async (req, res) => {
  let { assigneeIds, questionId } = req.body;

  assigneeIds.forEach(async (assigneeId) => {
    await knex("peer_review_results").returning("*").insert({
      questionId: questionId,
      reviewerId: assigneeId,
      hasApproved: 0,
      hasRejected: 0,
    });
  });

  await knex("questions")
    .where("questionId", "=", questionId)
    .update("hasBeenAssigned", 1);

  res.json("success");
};

module.exports = {
  proposeQuestion,
  getAllQuestions,
  approveQuestion,
  getAvailableAssignees,
  setAssignees,
};
