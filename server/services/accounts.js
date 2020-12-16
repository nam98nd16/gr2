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

module.exports = {
  register,
  login,
};
