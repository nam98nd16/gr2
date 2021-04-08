var express = require("express");
var router = express.Router();
const service = require("../services/friends");

router.post("/search", service.searchFriends);
router.post("/search/count", service.getSearchedFriendsCount);

module.exports = router;
