const axios = require("axios");

class TwitterApiV1 {
  static Build() {
    const twitterApiV1 = new TwitterApiV1(axios);

    return new Proxy(twitterApiV1, {
      get: function (target, property) {
        return target[property] || target.axios[target];
      },
    });
  }

  constructor(axios) {
    this.axios = axios.default.create({
      baseURL: "https://api.twitter.com/1.1/",
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      },
    });
    this.get = this.axios.get;
  }

  fget = async (url, options = {}, hashKey) => {
    console.log("Proxy Funtion activated!");
    return this.get(url, options);
  };
}

module.exports = TwitterApiV1;
