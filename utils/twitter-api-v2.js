const axios = require("axios");

module.exports = axios.default.create({
  baseURL: "https://api.twitter.com/2/",
  headers: {
    Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
  },
});
