var express = require("express");
var router = express.Router();
const service = require("../services/accounts");

router.get("/", service.test);
router.post("/register", service.register);
router.post("/login", service.login);

module.exports = router;
