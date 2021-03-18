var express = require("express");
var router = express.Router();
const service = require("../services/performance");

router.get("/", service.getPerformance);

module.exports = router;
