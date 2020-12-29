var express = require("express");
var router = express.Router();
const service = require("../services/questions");

router.post("/propose", service.proposeQuestion);
router.post("/update", service.updateQuestion);
router.get("/all", service.getAllQuestions);
router.post("/approve", service.approveQuestion);
router.post("/reject", service.rejectQuestion);
router.get("/assignees", service.getAvailableAssignees);
router.post("/assignees", service.setAssignees);

module.exports = router;
