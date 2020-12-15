/**
 * @param {Request} req Request object from express
 * @param {Response} res Response object from express
 */
const test = async (req, res) => {
  res.json("Hey thereeeeeee!");
};

module.exports = {
  test,
};
