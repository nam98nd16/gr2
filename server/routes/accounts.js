var express = require("express");
var router = express.Router();
const service = require("../services/accounts");

router.get("/", service.test);

module.exports = router;
