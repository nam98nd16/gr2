const knex = require("../config/database");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/const");
const moment = require("moment");
const validDays = 7;
const bcrypt = require("bcrypt");
const saltRounds = 10;

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const searchFriends = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let { keyword, filteredOption, perPage, currentPage } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);

  let query = knex("accounts")
    .select("username", "userId", "fullName", "role", "subjectId")
    .where("userId", "<>", reqUser.userId).where("username", "not ilike", "guest");

  query = await getUpdatedQuery(
    query,
    keyword,
    filteredOption,
    reqUser,
    perPage,
    currentPage
  );

  let users = await query;

  let possibleFriends = await knex("friends")
    .where(function () {
      this.whereIn(
        "userId1",
        users.map((u) => u.userId)
      ).orWhereIn(
        "userId2",
        users.map((u) => u.userId)
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
      users.find((u) => u.userId == f.userId1).hasBeenRequested = f;
    else users.find((u) => u.userId == f.userId2).hasRequested = f;
  });

  res.json(users);
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getSearchedFriendsCount = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let { keyword, filteredOption } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);

  let query = knex("accounts").count().where("username", "not ilike", "guest");

  query = await getUpdatedQuery(query, keyword, filteredOption, reqUser);
  let count = await query;
  res.json(parseInt(count[0].count));
};

let getUpdatedQuery = async (
  query,
  keyword,
  filteredOption,
  reqUser,
  perPage,
  currentPage
) => {
  if (keyword)
    query = query.where(function () {
      this.where("username", "ilike", `%${keyword}%`).orWhere(
        "fullName",
        "ilike",
        `%${keyword}%`
      );
    });

  if (filteredOption == "onlyMyFriends") {
    let friendships = await knex("friends")
      .where(function () {
        this.where({ userId1: reqUser.userId }).orWhere({
          userId2: reqUser.userId,
        });
      })
      .andWhere({ confirmed: 1 });
    query = query.whereIn(
      "userId",
      friendships.map((f) =>
        f.userId1 == reqUser.userId ? f.userId2 : f.userId1
      )
    );
  } else if (filteredOption == "friendRequests") {
    let friendships = await knex("friends")
      .where(function () {
        this.where({ userId1: reqUser.userId });
      })
      .andWhere({ confirmed: 0 });
    query = query.whereIn(
      "userId",
      friendships.map((f) => f.userId2)
    );
  } else if (filteredOption == "requestedFriends") {
    let friendships = await knex("friends")
      .where(function () {
        this.where({ userId2: reqUser.userId });
      })
      .andWhere({ confirmed: 0 });
    query = query.whereIn(
      "userId",
      friendships.map((f) => f.userId1)
    );
  }
  if (perPage && currentPage) {
    query = query.paginate({ perPage: perPage, currentPage: currentPage });
    query = await query;
    query = query.data;
  }
  return query;
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const addFriend = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let { userId } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);

  await knex("friends").insert({
    userId1: userId,
    userId2: reqUser.userId,
    confirmed: 0,
    dateRequested: moment(),
  });

  res.json("success");
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const deleteFriend = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let { userId } = req.query;

  let reqUser = jwt.verify(token, jwtSecret);

  await knex("friends")
    .where({ userId1: userId, userId2: reqUser.userId })
    .orWhere({ userId2: userId, userId1: reqUser.userId })
    .del();

  res.json("success");
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const confirmFriend = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let { userId } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);

  await knex("friends")
    .where({ userId1: userId, userId2: reqUser.userId })
    .orWhere({ userId2: userId, userId1: reqUser.userId })
    .update({
      confirmed: 1,
      dateConfirmed: moment(),
    });

  res.json("success");
};

module.exports = {
  searchFriends,
  getSearchedFriendsCount,
  addFriend,
  deleteFriend,
  confirmFriend,
};
