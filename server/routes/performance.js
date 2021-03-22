var express = require("express");
var router = express.Router();
const service = require("../services/performance");

router.post("/", service.getPerformance);
router.post("/rated", service.getPastRatings);

module.exports = router;
