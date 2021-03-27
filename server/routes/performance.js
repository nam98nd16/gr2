var express = require("express");
var router = express.Router();
const service = require("../services/performance");

router.post("/", service.getPerformance);
router.post("/rated", service.getPastRatings);
router.get("/top-ratings", service.getTopRatings);

module.exports = router;
