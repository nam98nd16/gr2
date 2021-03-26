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
  let { subjectName, sortKey, sortOrder, perPage, currentPage } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);
  let query = knex
    .column()
    .select()
    .from("subjects")
    .orderBy(sortKey, sortOrder);

  if (subjectName)
    query = query.where("subjectName", "ilike", `%${subjectName}%`);
  if (perPage && currentPage)
    query = query.paginate({ perPage: perPage, currentPage: currentPage });
  let subjects = await query;
  if (perPage && currentPage) subjects = subjects.data;

  let experts = await knex("accounts")
    .select("userId", "username", "role", "subjectId")
    .where("subjectId", ">=", 0)
    .whereIn(
      "subjectId",
      subjects.map((s) => s.subjectId)
    );

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
const getSubjectsCount = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let { subjectName } = req.body;

  let reqUser = jwt.verify(token, jwtSecret);
  let query = knex("subjects").count();

  if (subjectName)
    query = query.where("subjectName", "ilike", `%${subjectName}%`);
  let count = await query;

  res.json(parseInt(count[0].count));
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

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const addSubject = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let reqUser = jwt.verify(token, jwtSecret);

  let { subjectTitle, subjectLeaderId, subjectExpertIds } = req.body;

  let existedSubjects = await knex("subjects").where(
    "subjectName",
    "ilike",
    subjectTitle
  );

  if (existedSubjects.length) {
    res.json("A subject having that name already existed!");
    return;
  }

  let insertedSubject = await knex("subjects")
    .insert({
      subjectName: subjectTitle,
    })
    .returning("*");

  insertedSubject = insertedSubject[0];

  if (subjectLeaderId)
    await knex("accounts")
      .update({
        role: 1,
        subjectId: insertedSubject.subjectId,
      })
      .where("userId", "=", subjectLeaderId);

  if (subjectExpertIds.length)
    await knex("accounts")
      .update({
        role: 2,
        subjectId: insertedSubject.subjectId,
      })
      .whereIn("userId", subjectExpertIds);

  res.json("Added successfully!");
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const updateSubject = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let reqUser = jwt.verify(token, jwtSecret);

  let { subjectId, subjectTitle, subjectLeaderId, subjectExpertIds } = req.body;
  await Promise.all([
    knex("subjects")
      .where("subjectId", "=", subjectId)
      .update({ subjectName: subjectTitle }),
    knex("accounts")
      .update({
        role: 3,
        subjectId: null,
      })
      .where("subjectId", "=", subjectId),
  ]);

  if (subjectLeaderId)
    await knex("accounts")
      .update({
        role: 1,
        subjectId: subjectId,
      })
      .where("userId", "=", subjectLeaderId);

  if (subjectExpertIds.length)
    await knex("accounts")
      .update({
        role: 2,
        subjectId: subjectId,
      })
      .whereIn("userId", subjectExpertIds);

  res.json("success");
};

/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const removeSubject = async (req, res) => {
  let token = req.headers.authorization.substring(
    7,
    req.headers.authorization.length
  );
  let reqUser = jwt.verify(token, jwtSecret);

  let { subjectId } = req.query;

  let questions = await knex("questions")
    .where("subjectId", "=", subjectId)
    .limit(1);

  if (questions.length)
    res.json("Unable to delete subjects already having proposed questions!");
  else {
    await Promise.all([
      knex("subjects").where("subjectId", "=", subjectId).del(),
      knex("accounts")
        .where("subjectId", "=", subjectId)
        .whereIn("role", [1, 2])
        .update({
          role: 3,
          subjectId: null,
        }),
    ]);
    res.json("Deleted successfully!");
  }
};

module.exports = {
  getAllSubjects,
  getSubjects,
  getNonExpertUsers,
  addSubject,
  removeSubject,
  updateSubject,
  getSubjectsCount,
};
