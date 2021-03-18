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
  let { subjectId } = req.query;
  let performances;
  if (subjectId == 0)
    performances = await knex("test_results")
      .select("*")
      .where("testTakerId", "=", reqUser.userId);
  else
    performances = await knex("test_results")
      .select("*")
      .where("testTakerId", "=", reqUser.userId)
      .where("subjectId", "=", subjectId);

  res.json(performances);
};

module.exports = {
  getPerformance,
};
