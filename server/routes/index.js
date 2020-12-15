var express = require("express");
var router = express.Router();
const service = require("../services/index");

router.get("/", service.test);
router.use("/accounts", require("./accounts"));

module.exports = router;
