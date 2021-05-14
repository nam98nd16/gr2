const knex = require("../config/database");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/const");
const moment = require("moment");
var _ = require("lodash");
const { sub } = require("../config/const");

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
  let { userId, subjectId, difficultyLevel, startDate, endDate } = req.body;
  let performances;
  let query = knex("test_results")
    .select("*")
    .where("testTakerId", "=", userId);
  if (subjectId != 0) query = query.where("subjectId", "=", subjectId);
  if (difficultyLevel != 0)
    query = query.where("difficultyLevel", "=", difficultyLevel);
  if (!startDate) startDate = "1901-01-01";
  if (!endDate) endDate = "2100-12-31";
  else endDate = moment(endDate).add(1, "days").format("YYYY-MM-DD");
  query = query
    .whereBetween("startTime", [startDate, endDate])
    .orderBy("startTime", "asc");

  performances = await query;

  res.json(performances);
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getPastRatings = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let reqUser = jwt.verify(token, jwtSecret);
  let { userId, subjectId, startDate, endDate } = req.body;

  if (!startDate) startDate = moment("2000-01-01").format("YYYY-MM-DD");
  if (!endDate) endDate = moment("2099-12-31").format("YYYY-MM-DD");

  let pastRatings;
  let query;

  if (subjectId != 0) {
    if (startDate == endDate) {
      query = knex("rated_test_results")
        .select(knex.raw(`"submittedTime", "ratingChange", "updatedRating"`))
        .where("userId", "=", userId)
        .where("subjectId", "=", subjectId)
        .where(knex.raw(`"submittedTime"::date = '${startDate}'`));
    } else
      query = knex.raw(
        `select distinct t_outer."submittedTime"::date + interval '23 hours' as "submittedTime", t_top."ratingChange", t_top."updatedRating" from rated_test_results t_outer join lateral (select * from rated_test_results t_inner where t_inner."submittedTime"::date >= '${startDate}' and t_inner."submittedTime"::date <= '${endDate}' and  t_inner."userId" = ${userId} and t_inner."subjectId" = ${subjectId} and t_inner."submittedTime"::date = t_outer."submittedTime"::date order by t_inner."submittedTime" DESC limit 1) t_top on true order by t_outer."submittedTime"::date + interval '23 hours';`
      );

    pastRatings = await query;

    if (startDate != endDate) pastRatings = pastRatings.rows;
  } else {
    query = knex("ratings").where("userId", "=", userId);
    pastRatings = await query;
  }

  res.json(pastRatings);
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getTopRatings = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let reqUser = jwt.verify(token, jwtSecret);

  let { subjectId, onlyMyFriends } = req.query;

  let query = knex("ratings")
    .select(
      "username",
      "accounts.userId",
      "accounts.role",
      "accounts.subjectId",
      "rating"
    )
    .join("accounts", "ratings.userId", "=", "accounts.userId")
    .where("ratings.subjectId", "=", subjectId).where("username", "not ilike", "guest");

  if (onlyMyFriends === "true") {
    let friendships = await knex("friends")
      .where(function () {
        this.where({ userId1: reqUser.userId }).orWhere({
          userId2: reqUser.userId,
        });
      })
      .andWhere({ confirmed: 1 });
    query = query.whereIn(
      "ratings.userId",
      friendships.map((f) =>
        f.userId1 == reqUser.userId ? f.userId2 : f.userId1
      )
    );
  }

  query = query.orderBy("rating", "desc").limit(10);

  let topRatings = await query;

  let possibleFriends = await knex("friends")
    .where(function () {
      this.whereIn(
        "userId1",
        topRatings
          .filter((t) => t.userId != reqUser.userId)
          .map((u) => u.userId)
      ).orWhereIn(
        "userId2",
        topRatings
          .filter((t) => t.userId != reqUser.userId)
          .map((u) => u.userId)
      );
    })
    .andWhere(function () {
      this.where("userId1", "=", reqUser.userId).orWhere(
        "userId2",
        "=",
        reqUser.userId
      );
    });

  possibleFriends.forEach((f) => {
    if (f.userId2 == reqUser.userId)
      topRatings.find((u) => u.userId == f.userId1).hasBeenRequested = f;
    else topRatings.find((u) => u.userId == f.userId2).hasRequested = f;
  });

  res.json(topRatings);
};

module.exports = {
  getPerformance,
  getPastRatings,
  getTopRatings,
};
