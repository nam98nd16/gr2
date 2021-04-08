const knex = require("../config/database");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/const");
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
  let { keyword, perPage, currentPage } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);

  let query = knex("accounts").select(
    "username",
    "userId",
    "fullName",
    "role",
    "subjectId"
  );

  if (keyword)
    query = query
      .where("username", "ilike", `%${keyword}%`)
      .orWhere("fullName", "ilike", `%${keyword}%`);
  if (perPage && currentPage)
    query = query.paginate({ perPage: perPage, currentPage: currentPage });

  let users = await query;
  if (perPage && currentPage) users = users.data;
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
  let { keyword } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);

  let query = knex("accounts").count();

  if (keyword)
    query = query
      .where("username", "ilike", `%${keyword}%`)
      .orWhere("fullName", "ilike", `%${keyword}%`);

  let count = await query;
  res.json(parseInt(count[0].count));
};

module.exports = {
  searchFriends,
  getSearchedFriendsCount,
};
