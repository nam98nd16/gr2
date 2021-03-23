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

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getSubjects = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let { subjectName } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);
  let query = knex.column().select().from("subjects");
  if (subjectName)
    query = query.where("subjectName", "like", `%${subjectName}%`);
  let subjects = await query;

  let experts = await knex("accounts")
    .select("userId", "username", "role", "subjectId")
    .where("subjectId", ">=", 0)
    .whereIn(
      "subjectId",
      subjects.map((s) => s.subjectId)
    );

  console.log("e", experts);

  subjects.forEach((s) => {
    s.leader = experts.find((e) => e.role == 1 && e.subjectId == s.subjectId);
    s.experts = experts.filter(
      (e) => e.role == 2 && e.subjectId == s.subjectId
    );
  });

  res.json(subjects);
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const getNonExpertUsers = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let reqUser = jwt.verify(token, jwtSecret);

  let { key } = req.query;
  let users = await knex()
    .select("username", "userId")
    .from("accounts")
    .whereIn("role", [1, 2, 3])
    .where("username", "like", `%${key}%`)
    .where(knex.raw(`"subjectId" is null`))
    .limit(10);
  res.json(users);
};

module.exports = {
  getAllSubjects,
  getSubjects,
  getNonExpertUsers,
};
