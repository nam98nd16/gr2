const knex = require("../config/database");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/const");
var _ = require("lodash");

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getPerformance = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let reqUser = jwt.verify(token, jwtSecret);
  let { subjectId, difficultyLevel, startDate, endDate } = req.body;
  let performances;
  let query = knex("test_results")
    .select("*")
    .where("testTakerId", "=", reqUser.userId);
  if (subjectId != 0) query = query.where("subjectId", "=", subjectId);
  if (difficultyLevel != 0)
    query = query.where("difficultyLevel", "=", difficultyLevel);
  if (!startDate) startDate = "1901-01-01";
  if (!endDate) endDate = "2100-12-31";
  query = query.whereBetween("startTime", [startDate, endDate]);

  performances = await query;

  res.json(performances);
};

module.exports = {
  getPerformance,
};
