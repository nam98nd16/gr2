var express = require("express");
var router = express.Router();
const service = require("../services/accounts");

router.post("/register", service.register);
router.post("/login", service.login);
router.post("/update", service.updateProfile);
router.get("/all", service.getAllUsers);
router.post("/update-roles", service.updateUsersRole);

module.exports = router;
