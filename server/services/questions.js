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
  let isPassedPreliminaryReview =
    reqUser.role != 3 && reqUser.role != 5 ? 1 : 0;
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
const updateQuestion = async (req, res) => {
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
    questionId,
  } = req.body;

  let answers = [answer1, answer2, answer3, answer4];
  let correctAnswerId = answers.find((answer) => answer.isCorrect).id;
  let reqUser = jwt.verify(token, jwtSecret);
  let addedQuestion = await knex("questions")
    .returning("*")
    .where("questionId", "=", questionId)
    .update({
      questionString: questionString,
      answerId: correctAnswerId,
      subjectId: topicId,
      difficultyLevel: difficultyLevel,
      timeAllowed: allowedTime,
      hasBeenRejected: 0,
      hasBeenReported: 0,
    });

  await knex("reports").where("questionId", "=", questionId).del();

  let addedAnswers = [];
  let insertAnswers = new Promise((resolve, reject) => {
    answers.forEach(async (answer, index, arr) => {
      let ans = await knex("answers")
        .returning("*")
        .where("answerId", "=", answer.id)
        .update({
          answerString: answer.string,
        });
      addedAnswers.push(ans[0]);
      if (index === arr.length - 1) resolve();
    });
  });

  insertAnswers.then(async () => {
    await knex("peer_review_results")
      .where("questionId", "=", questionId)
      .update("hasRejected", 0);
    res.json({
      updatedQuestion: addedQuestion[0],
      updatedAnswers: addedAnswers,
    });
  });
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const deleteQuestion = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let { questionId } = req.query;

  let reqUser = jwt.verify(token, jwtSecret);
  await knex("questions").where("questionId", "=", questionId).del();

  res.json("success");
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const reportQuestion = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let { questionId, reason } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);
  let reportedQuestion = await knex("reports").returning("*").insert({
    reason: reason,
    reporterId: reqUser.userId,
    questionId: questionId,
  });

  await knex("questions").where("questionId", "=", questionId).update({
    hasBeenReported: 1,
  });

  res.json({ reportedQuestion: reportedQuestion });
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const ignoreReports = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let { questionId } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);

  await knex("reports").where("questionId", "=", questionId).del();

  await knex("questions").where("questionId", "=", questionId).update({
    hasBeenReported: 0,
  });

  res.json("success");
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

  let reports = await knex
    .column()
    .select("reporterId", "reason", "username", "questionId")
    .from("reports")
    .leftJoin("accounts", "reports.reporterId", "accounts.userId");

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
      rejectReason: questions[questionId][index].rejectReason,
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

  let trueReports = _.groupBy(reports, function (item) {
    return item.questionId;
  });

  for (let questionId in assignees) {
    let questionIndex = trueQuestions.findIndex(
      (question) => question.questionId == questionId
    );
    trueQuestions[questionIndex].assignees = assignees[questionId].map(
      (assignee) => ({ ...assignee, questionId: undefined })
    );
  }

  for (let questionId in trueReports) {
    let questionIndex = trueQuestions.findIndex(
      (question) => question.questionId == questionId
    );
    trueQuestions[questionIndex].reports = trueReports[questionId].map(
      (report) => ({ ...report, questionId: undefined })
    );
  }

  res.json(trueQuestions);
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getViewableQuestions = async (req, res) => {
  let {
    keyword,
    wfReviewFiltered,
    wfAssigneeFiltered,
    reportedFiltered,
    myQuestionsFiltered,
    perPage,
    currentPage,
  } = req.body;
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let reqUser = jwt.verify(token, jwtSecret);

  let query = knex.column().select().from("questions");

  if (reqUser.role != 5)
    query = query.where(
      knex.raw(
        `"creatorId" not in (select "userId" from accounts where "username" ilike 'guest')`
      )
    );

  query = await getUpdatedQuery(
    query,
    keyword,
    wfReviewFiltered,
    wfAssigneeFiltered,
    reportedFiltered,
    myQuestionsFiltered,
    reqUser,
    perPage,
    currentPage
  );

  questions = await query;

  let peerReviewResults = await knex("peer_review_results").whereIn(
    "questionId",
    questions.map((q) => q.questionId)
  );

  let answers = await knex("answers").whereIn(
    "questionId",
    questions.map((q) => q.questionId)
  );

  let reports = await knex
    .column()
    .select("reporterId", "reason", "username", "questionId")
    .from("reports")
    .leftJoin("accounts", "reports.reporterId", "accounts.userId")
    .whereIn(
      "questionId",
      questions.map((q) => q.questionId)
    );

  questions.forEach((question) => {
    question.answers = answers
      .filter((ans) => ans.questionId == question.questionId)
      .map((a) => ({
        answerId: a.answerId,
        answerString: a.answerString,
        isCorrect: a.answerId == question.answerId,
      }));

    question.assignees = peerReviewResults
      .filter((re) => re.questionId == question.questionId)
      .map((a) => ({ ...a, questionId: undefined }));

    question.reports = reports
      .filter((re) => re.questionId == question.questionId)
      .map((r) => ({ ...r, questionId: undefined }));
  });

  res.json(questions);
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getViewableQuestionsCount = async (req, res) => {
  let {
    keyword,
    wfReviewFiltered,
    wfAssigneeFiltered,
    reportedFiltered,
    myQuestionsFiltered,
  } = req.body;
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let reqUser = jwt.verify(token, jwtSecret);

  let query = knex("questions").count();

  if (reqUser.role != 5)
    query = query.where(
      knex.raw(
        `"creatorId" not in (select "userId" from accounts where "username" ilike 'guest')`
      )
    );

  query = await getUpdatedQuery(
    query,
    keyword,
    wfReviewFiltered,
    wfAssigneeFiltered,
    reportedFiltered,
    myQuestionsFiltered,
    reqUser
  );

  let count = await query;

  res.json(parseInt(count[0].count));
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
  } else if (isForPeerReview) {
    await knex("peer_review_results")
      .where("questionId", "=", questionId)
      .where("reviewerId", "=", reqUser.userId)
      .update("hasApproved", 1);
    let peerReviewResults = await knex
      .column()
      .select()
      .from("peer_review_results")
      .where("questionId", "=", questionId);

    let hasPassedPeerReview =
      peerReviewResults.filter((result) => result.hasApproved === "1").length >=
      2;

    if (hasPassedPeerReview)
      await knex("questions")
        .where("questionId", "=", questionId)
        .update("passedPeerReview", 1);

    res.json("success");
  } else if (isForFinalReview) {
    await knex("questions")
      .where("questionId", "=", questionId)
      .update("passedFinalReview", 1);
    res.json("success");
  }
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const rejectQuestion = async (req, res) => {
  let {
    isForPreliminaryReview,
    isForPeerReview,
    isForFinalReview,
    questionId,
    rejectReason,
  } = req.body;
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let reqUser = jwt.verify(token, jwtSecret);
  if (isForPreliminaryReview || isForFinalReview) {
    await knex("questions")
      .where("questionId", "=", questionId)
      .update("hasBeenRejected", 1)
      .update("rejectReason", rejectReason);
    res.json("success");
  } else if (isForPeerReview) {
    await knex("peer_review_results")
      .where("questionId", "=", questionId)
      .where("reviewerId", "=", reqUser.userId)
      .update("hasRejected", 1)
      .update("rejectReason", rejectReason);

    let peerReviewResults = await knex
      .column()
      .select()
      .from("peer_review_results")
      .where("questionId", "=", questionId);

    let hasFailedPeerReview =
      peerReviewResults.filter((result) => result.hasRejected === "1").length >=
      2;

    if (hasFailedPeerReview)
      await knex("questions")
        .where("questionId", "=", questionId)
        .update("hasBeenRejected", 1);

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

let getUpdatedQuery = async (
  query,
  keyword,
  wfReviewFiltered,
  wfAssigneeFiltered,
  reportedFiltered,
  myQuestionsFiltered,
  reqUser,
  perPage,
  currentPage
) => {
  let isNormalUser = () => {
    return reqUser.role === 3;
  };
  let isAdmin = () => {
    return reqUser.role === 0;
  };
  let isSubjectExpert = () => {
    return reqUser.role === 2;
  };
  let isSubjectLeader = () => {
    return reqUser.role === 1;
  };
  let isPreliminaryReviewer = () => {
    return reqUser.role === 4;
  };

  if (keyword) query = query.where("questionString", "ilike", `%${keyword}%`);

  if (
    !wfReviewFiltered &&
    !wfAssigneeFiltered &&
    !reportedFiltered &&
    !myQuestionsFiltered
  ) {
    if (isNormalUser()) query = query.whereRaw("1=0");
    else if (!isAdmin())
      query = query.where({
        passedFinalReview: 1,
        subjectId: reqUser.subjectId,
      });
  } else {
    if (wfReviewFiltered) {
      if (isPreliminaryReviewer())
        query = query.where({ passedPreliminaryReview: 0, hasBeenRejected: 0 });
      else if (isSubjectExpert() || isSubjectLeader() || isAdmin()) {
        let peerReviews = await knex("peer_review_results").where(
          "reviewerId",
          "=",
          reqUser.userId
        );
        if (isSubjectExpert())
          query = query
            .where({
              subjectId: reqUser.subjectId,
              hasBeenAssigned: 1,
              passedPeerReview: 0,
              hasBeenRejected: 0,
            })
            .whereIn(
              "questionId",
              peerReviews
                .filter((r) => r.hasApproved === "0" && r.hasRejected === "0")
                .map((q) => parseInt(q.questionId))
            );
        else if (isAdmin() || isSubjectLeader())
          query = query
            .where(function () {
              this.where({ hasBeenAssigned: 1, hasBeenRejected: 0 }).whereIn(
                "questionId",
                peerReviews
                  .filter((r) => r.hasApproved === "0" && r.hasRejected === "0")
                  .map((q) => parseInt(q.questionId))
              );
            })
            .orWhere({
              subjectId: reqUser.subjectId,
              passedPreliminaryReview: 1,
              passedPeerReview: 1,
              passedFinalReview: 0,
              hasBeenRejected: 0,
            });
      }
    }
    if (reportedFiltered) {
      query = query.where({ hasBeenReported: 1, subjectId: reqUser.subjectId });
    }
    if (wfAssigneeFiltered) {
      query = query.where({
        passedPreliminaryReview: 1,
        hasBeenAssigned: 0,
        subjectId: reqUser.subjectId,
        hasBeenRejected: 0,
      });
    }
    if (myQuestionsFiltered) {
      query = query.where({ creatorId: reqUser.userId });
    }
  }
  if (perPage && currentPage) {
    query = query.paginate({ perPage: perPage, currentPage: currentPage });
    query = await query;
    query = query.data;
  }

  return query;
};

module.exports = {
  proposeQuestion,
  updateQuestion,
  deleteQuestion,
  reportQuestion,
  ignoreReports,
  getAllQuestions,
  approveQuestion,
  rejectQuestion,
  getAvailableAssignees,
  setAssignees,
  getViewableQuestions,
  getViewableQuestionsCount,
};
