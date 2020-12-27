var express = require("express");
var router = express.Router();
const service = require("../services/questions");

router.post("/propose", service.proposeQuestion);
router.get("/all", service.getAllQuestions);
router.post("/approve", service.approveQuestion);
router.get("/assignees", service.getAvailableAssignees);

module.exports = router;
