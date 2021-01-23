var express = require("express");
var router = express.Router();
const service = require("../services/test");

router.post("/get-questions", service.getTestQuestions);

module.exports = router;
