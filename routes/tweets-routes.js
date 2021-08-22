const router = require("express").Router();
const tweetsController = require("../controllers/tweets-controller");

router.get("/getTweets", tweetsController.getTweets);

module.exports = router;
