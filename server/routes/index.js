var express = require("express");
var router = express.Router();
const service = require("../services/index");

router.get("/", service.test);

module.exports = router;
