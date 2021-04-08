var express = require("express");
var router = express.Router();
const service = require("../services/accounts");

router.post("/register", service.register);
router.post("/login", service.login);
router.post("/update", service.updateProfile);
router.get("/all", service.getAllUsers);
router.post("/users", service.getUsers);
router.post("/users/count", service.getUsersCount);
router.post("/update-roles", service.updateUsersRole);
router.post("/update-role", service.updateUserRole);
router.post("/update-avatar", service.updateAvatar);

module.exports = router;
