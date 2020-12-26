var express = require("express");
var router = express.Router();
const service = require("../services/questions");

router.post("/propose", service.proposeQuestion);

module.exports = router;
