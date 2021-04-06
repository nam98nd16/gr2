var express = require("express");
var router = express.Router();
const service = require("../services/questions");

router.post("/propose", service.proposeQuestion);
router.post("/update", service.updateQuestion);
router.delete("/delete", service.deleteQuestion);
router.post("/report", service.reportQuestion);
router.post("/ignore-report", service.ignoreReports);
router.get("/all", service.getAllQuestions);
router.post("/all-viewable", service.getViewableQuestions);
router.post("/all-viewable/count", service.getViewableQuestionsCount);
router.post("/approve", service.approveQuestion);
router.post("/reject", service.rejectQuestion);
router.get("/assignees", service.getAvailableAssignees);
router.post("/assignees", service.setAssignees);

module.exports = router;
