const knex = require("../config/database");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/const");

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getAllSubjects = async (req, res) => {
  const subjects = await knex.column().select().from("subjects");
  res.json(subjects);
};

module.exports = {
  getAllSubjects,
};
