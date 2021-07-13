const router = require('express').Router();
const trendsController = require("../controllers/trends-controller");

router.get(
    "/getTrends",
    trendsController.getTrends
);

router.get(
    "/getWoeid",
    trendsController.getWoeid
)

module.exports = router;