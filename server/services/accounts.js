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
const register = async (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
    // Store hash in your password DB.
    if (err) res.status(500).json(err.message);
    try {
      let user = await knex("accounts").returning("*").insert({
        username: req.body.username,
        password: hash,
      });
      res.json({ user: user });
    } catch (error) {
      res.status(400).json(error);
    }
  });
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const login = async (req, res) => {
  const users = await knex
    .column()
    .select()
    .from("accounts")
    .where({ username: req.body.username });
  if (!users.length) res.status(400).json("Account not existed!");
  else {
    let user = users[0];
    bcrypt.compare(req.body.password, user.password, async (err, result) => {
      if (result) {
        user.password = undefined;
        const token = jwt.sign(user, jwtSecret, {
          expiresIn: validDays * 24 + "h",
          algorithm: "HS256",
        });
        return res.json(token);
      } else res.status(400).json("Invalid password!");
    });
  }
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const updateProfile = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let reqUser = jwt.verify(token, jwtSecret);
  let {
    fullName,
    phoneNumber,
    autobiography,
    birthday,
    gender,
    address,
    email,
  } = req.body;
  let updatedProfile = await knex("accounts")
    .returning("*")
    .where("userId", "=", reqUser.userId)
    .update({
      fullName: fullName,
      phoneNumber: phoneNumber,
      autobiography: autobiography,
      birthday: birthday,
      gender: gender,
      address: address,
      email: email,
    });
  updatedProfile = updatedProfile[0];
  updatedProfile.password = undefined;
  const newToken = jwt.sign(updatedProfile, jwtSecret, {
    expiresIn: validDays * 24 + "h",
    algorithm: "HS256",
  });
  return res.json(newToken);
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getAllUsers = async (req, res) => {
  let users = await knex("accounts")
    .column()
    .select("userId", "username", "role", "subjectId");

  users = users.sort((a, b) => a.userId - b.userId);

  res.json(users);
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getUsers = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let reqUser = jwt.verify(token, jwtSecret);
  let {
    username,
    userId,
    sortKey,
    sortOrder,
    perPage,
    currentPage,
    role,
    subjectId,
  } = req.body;

  let query = knex("accounts").select(
    "userId",
    "username",
    "role",
    "subjectId"
  );

  if (sortOrder && sortKey) query = query.orderBy(sortKey, sortOrder);

  if (username) query = query.where("username", "ilike", `%${username}%`);
  if ([0, 1, 2, 3, 4].includes(role)) query = query.where("role", "=", role);
  if (subjectId) query = query.where("subjectId", "=", subjectId);
  if (userId) query = query.whereRaw(`"userId"::varchar like '%${userId}%'`);
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
const getUsersCount = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let { username, userId, role, subjectId } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);
  let query = knex("accounts").count();

  if (username) query = query.where("username", "ilike", `%${username}%`);
  if (userId) query = query.whereRaw(`"userId"::varchar like '%${userId}%'`);
  if ([0, 1, 2, 3, 4].includes(role)) query = query.where("role", "=", role);
  if (subjectId) query = query.where("subjectId", "=", subjectId);
  let count = await query;

  res.json(parseInt(count[0].count));
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const updateUsersRole = async (req, res) => {
  let { users } = req.body;
  let queries = [];
  users.forEach((user) => {
    queries.push(
      knex("accounts")
        .where("userId", "=", user.userId)
        .update("role", user.role)
        .update("subjectId", user.subjectId)
    );
  });
  await Promise.all(queries);

  res.json("success");
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const updateUserRole = async (req, res) => {
  let { user } = req.body;

  if (user.role == 1) {
    let existedLeader = await knex("accounts")
      .where("subjectId", "=", user.subjectId)
      .where("role", "=", 1);
    if (existedLeader.length) {
      res.json("The subject already has a leader!");
      return;
    }
  }

  await knex("accounts")
    .where("userId", "=", user.userId)
    .update("role", user.role)
    .update("subjectId", user.subjectId);

  res.json("Updated successfully!");
};

module.exports = {
  register,
  login,
  updateProfile,
  getAllUsers,
  updateUsersRole,
  updateUserRole,
  getUsers,
  getUsersCount,
};
