const twitterAPI = require("../utils/twitter-api").Build();

const getTrends = async (req, res, next) => {
  const { woeid, limit } = req.query;
  let trends = req.app.get("trends");

  if (!woeid || !limit) {
    return res.json({
      status: 400,
      message: "Malformed Request",
      data: null,
      errors: true,
    });
  }

  if (!trends.list[woeid] || isTimerExpired(trends.timestamp[woeid])) {
    twitterAPI
      .get("/trends/place.json", { params: { id: woeid } })
      .then(async (response) => {
        // console.log(response.data);
        const serverDate = req.app.get("start-time");
        trends.saveTrends(woeid, response.data, serverDate);

        res.json({
          status: 200,
          message: "trends fetched (Fresh)",
          hash: trends.provideCurrentHash(woeid),
          data: trends.getTrends(woeid, limit),
          errors: false,
        });

        //Do optimization on list after response
        trends.optimizeTrends(woeid, trends.list[woeid]);
        trends.enableAutoPing(woeid, 10, 325500);
      })
      .catch((err) => {
        console.log(err);

        res.json({
          status: 400,
          message: "Bad Request",
          data: null,
          errors: true,
        });
      });
  } else {
    trends.refreshTimestamp(woeid, trends.list[woeid]);

    res.json({
      status: 200,
      message: "trends fetched (CACHE)",
      hash: trends.provideCurrentHash(woeid),
      data: trends.getTrends(woeid, limit),
      errors: false,
    });
  }
};

const getWoeid = async (req, res, next) => {
  const { lat, long } = req.query;

  twitterAPI
    .get("/trends/closest.json", { params: { lat, long } })
    .then((response) => {
      console.log(response.data);

      res.json({
        status: 200,
        message: "woeid fetched",
        data: response.data,
        errors: false,
      });
    })
    .catch((err) => {
      console.log(err);

      res.json({
        status: 400,
        message: "Bad Request",
        data: null,
        errors: true,
      });
    });
};

const isTimerExpired = (date) => {
  let isSafe = false;
  if (date) {
    const diifDate = (new Date() - date) / (60 * 1000);
    console.log("Diff date :" + diifDate);
    if (diifDate > 5) {
      isSafe = true;
    }
  } else {
    isSafe = true;
  }

  return isSafe;
};

exports.getTrends = getTrends;
exports.getWoeid = getWoeid;
