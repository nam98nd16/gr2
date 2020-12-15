const knex = require("../config/database");
/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const test = async (req, res) => {
  const users = await knex
    .column()
    .select()
    .from("accounts")
    .where({ userId: 1 });
  res.json({ a: users });
};

module.exports = {
  test,
};
