var express = require("express");
var router = express.Router();
const service = require("../services/subjects");

router.get("/", service.getAllSubjects);
router.post("/", service.getSubjects);
router.get("/non-experts", service.getNonExpertUsers);
router.post("/add", service.addSubject);

module.exports = router;
