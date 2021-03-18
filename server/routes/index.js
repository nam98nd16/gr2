var express = require("express");
var router = express.Router();
const service = require("../services/index");

router.get("/", service.test);
router.use("/accounts", require("./accounts"));
router.use("/questions", require("./questions"));
router.use("/test", require("./test"));
router.use("/subjects", require("./subjects"));
router.use("/performance", require("./performance"));

module.exports = router;
