var express = require("express");
var router = express.Router();
const service = require("../services/friends");

router.post("/search", service.searchFriends);
router.post("/search/count", service.getSearchedFriendsCount);
router.post("/add", service.addFriend);
router.delete("/delete", service.deleteFriend);
router.post("/confirm", service.confirmFriend);

module.exports = router;
