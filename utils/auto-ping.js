const axios = require("axios");

const callToRefreshTrends = (woeid, limit, time) => {
  console.log("PINGING...");
  axios.default
    .get(
      `http://localhost:${
        process.env.PORT || 5000
      }/api/v1/trends/getTrends?woeid=${woeid}&limit=${limit}`
    )
    .then((res) => {
      console.log(`AUTO PING: COMPLETE! for Trends with woeid: ${woeid}`);
    });

  setTimeout(() => timer(woeid, limit, time), 100);
};

const timer = (woeid, limit, time) => {
  console.log(`AUTO PINGER: Sleeping... ${time}`);
  setTimeout(() => callToRefreshTrends(woeid, limit, time), time);
};

exports.callToRefreshTrends = callToRefreshTrends;
