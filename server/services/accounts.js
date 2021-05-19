const knex = require("../config/database");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/const");
var multiparty = require("multiparty");
var util = require("util");
const path = require("path");
const fs = require("fs");
const validDays = 7;
const bcrypt = require("bcrypt");
const saltRounds = 10;
var mv = require("mv");

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const register = async (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
    // Store hash in your password DB.
    if (err) res.status(500).json(err.message);

    let validateInput = async () => {
      let existedUser = await knex("accounts").where(
        "username",
        "ilike",
        req.body.username
      );

      if (existedUser.length) {
        res.status(400).json({
          detail: `Key (username)=(${req.body.username}) already exists.`,
        });
        return true;
      } else return false;
    };

    let invalidUsername = await validateInput();
    if (invalidUsername) return;

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
    .where("username", "ilike", req.body.username);

  let validateInput = () => {
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

  validateInput();
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
    .select("userId", "username", "role", "subjectId")
    .where("username", "not ilike", "guest");

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

  let query = knex("accounts")
    .select("userId", "username", "role", "subjectId")
    .where("username", "not ilike", "guest");

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
  let query = knex("accounts").count().where("username", "not ilike", "guest");

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

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const updateAvatar = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );

  let reqUser = jwt.verify(token, jwtSecret);

  let preImagePath = await knex("accounts")
    .where("userId", "=", reqUser.userId)
    .select("avatarImagePath");

  preImagePath = preImagePath[0].avatarImagePath;

  fs.unlink(path.join(__dirname, `../public/${preImagePath}`), () => {});

  var form = new multiparty.Form();

  form.parse(req, async function (err, fields, files) {
    if (files.image) {
      let image = files.image[0];
      let randomImageName = makeid(5) + path.extname(image.originalFilename);
      let pathToStore = `images/${randomImageName}`;
      const tempPath = image.path;
      const targetPath = path.join(__dirname, `../public/${pathToStore}`);

      mv(tempPath, targetPath, async (err) => {
        if (err) return handleError(err, res);
        await knex("accounts")
          .where("userId", "=", reqUser.userId)
          .update({ avatarImagePath: pathToStore });

        let fullImgPath = `${process.env.baseURL}${pathToStore}`;
        res.json(fullImgPath);
      });
    } else {
      await knex("accounts")
        .where("userId", "=", reqUser.userId)
        .update({ avatarImagePath: null });
      res.json("");
    }
  });
};

function makeid(length) {
  var result = [];
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
}

const handleError = (err, res) => {
  console.log("err", err);
  res.status(500).json("Oops! Something went wrong!");
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getAvatar = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );

  let reqUser = jwt.verify(token, jwtSecret);

  let { userId } = req.query;

  let avatar = await knex("accounts")
    .where("userId", "=", userId)
    .select("avatarImagePath");

  avatar = avatar.length ? avatar[0].avatarImagePath : null;

  res.json(avatar ? `${process.env.baseURL}${avatar}` : null);
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getProfile = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );

  let reqUser = jwt.verify(token, jwtSecret);

  let { userId } = req.query;

  let friendship = await knex("friends")
    .where({ confirmed: 1 })
    .where(function () {
      this.where({ userId1: userId, userId2: reqUser.userId }).orWhere({
        userId2: userId,
        userId1: reqUser.userId,
      });
    });

  let areFriends = false;
  if (friendship.length) areFriends = true;

  let userProfile = await knex("accounts")
    .where("userId", "=", userId)
    .select(
      "username",
      "fullName",
      "address",
      "phoneNumber",
      "autobiography",
      "email",
      "role",
      "subjectId",
      "birthday",
      "gender"
    );

  userProfile = userProfile[0];
  res.json(userProfile);
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const resetGuestData = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );

  let reqUser = jwt.verify(token, jwtSecret);

  if (reqUser.role != 5) {
    res.json("Not a guest!");
    return;
  }

  let resetAccount = knex("accounts")
    .where("userId", "=", reqUser.userId)
    .update({
      fullName: null,
      address: null,
      phoneNumber: null,
      autobiography: null,
      email: null,
      role: 5,
      subjectId: null,
      birthday: null,
      gender: null,
      avatarImagePath: null,
    });

  let preImagePath = await knex("accounts")
    .where("userId", "=", reqUser.userId)
    .select("avatarImagePath");

  preImagePath = preImagePath[0].avatarImagePath;

  fs.unlink(path.join(__dirname, `../public/${preImagePath}`), () => {});

  let resetFriends = knex("friends")
    .where("userId1", "=", reqUser.userId)
    .orWhere("userId2", "=", reqUser.userId)
    .del();

  let resetQuestions = knex("questions")
    .where("creatorId", "=", reqUser.userId)
    .del();

  let resetRatedTestResults = knex("rated_test_results")
    .where("userId", "=", reqUser.userId)
    .del();

  let resetRatings = knex("ratings").where("userId", "=", reqUser.userId).del();

  let resetReports = knex("reports")
    .where("reporterId", "=", reqUser.userId)
    .del();

  let resetTestResults = knex("test_results")
    .where("testTakerId", "=", reqUser.userId)
    .del();

  let resetActions = [
    resetAccount,
    resetFriends,
    resetQuestions,
    resetRatedTestResults,
    resetRatings,
    resetReports,
    resetTestResults,
  ];

  await Promise.all(resetActions);

  res.json("Reset!");
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
  updateAvatar,
  getAvatar,
  getProfile,
  resetGuestData,
};
