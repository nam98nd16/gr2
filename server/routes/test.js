var express = require("express");
var router = express.Router();
const service = require("../services/test");

router.post("/get-questions", service.getTestQuestions);
router.post("/get-rated-question", service.getRatedQuestion);
router.post("/get-rating", service.getRating);
router.post("/submit", service.submitAnswers);

module.exports = router;
