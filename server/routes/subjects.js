var express = require("express");
var router = express.Router();
const service = require("../services/subjects");

router.get("/", service.getAllSubjects);
router.post("/", service.getSubjects);

module.exports = router;
