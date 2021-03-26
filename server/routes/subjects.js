var express = require("express");
var router = express.Router();
const service = require("../services/subjects");

router.get("/", service.getAllSubjects);
router.post("/", service.getSubjects);
router.post("/count", service.getSubjectsCount);
router.get("/non-experts", service.getNonExpertUsers);
router.post("/add", service.addSubject);
router.post("/update", service.updateSubject);
router.delete("/", service.removeSubject);

module.exports = router;
