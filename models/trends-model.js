const _ = require("lodash");
const crypto = require("crypto");
const isEnglish = require("is-english");
const helperUtils = require("../utils/helper_utils");
const autoPinger = require("../utils/auto-ping");

class Trends {
  constructor() {
    this.list = {};
    this.timestamp = {};
    this.trendCreatedAt = {};
    this.ranking = {};
    this.tempId = 0;
    this.autoPingStarted = new Set();
    this.trendsHash = {};
  }

  comparator = (trend_a, trend_b) => trend_a.name === trend_b.name;

  enableAutoPing = (woeid, limit, time) => {
    if (!this.autoPingStarted.has(woeid)) {
      this.autoPingStarted.add(woeid);
      autoPinger.callToRefreshTrends(woeid, limit, time);
    }
  };

  saveTrends = (woeid, trendsList, serverDate) => {
    const slimmed = trendsList[0]["trends"];
    console.log(`WOEID : ${woeid}`);
    if (parseInt(woeid) == 1) {
      console.log("ENG FILTER - Enabled");
      this.englishFilter(slimmed);
    }

    let ranker;
    if (!this.list[woeid] || this.isOneDayCompleted(serverDate)) {
      this.ranking[woeid] = {};
      ranker = this.ranking[woeid];
      this.trendCreatedAt[woeid] = {};
      slimmed.forEach((trend) => {
        ranker[trend.name] = 1;
        trend.state = "new";
        this.trendCreatedAt[woeid][trend.name] = new Date();
      });
    } else {
      const newTrendData = {};
      ranker = this.ranking[woeid];
      slimmed.forEach((trend) => {
        if (!ranker[trend.name]) {
          console.log(`NEW : ${trend.name}`);
          trend.state = "new";
          ranker[trend.name] = 1;
          this.trendCreatedAt[woeid][trend.name] = new Date();
        }
        newTrendData[trend.name] = true;
      });

      this.list[woeid].forEach((trend) => {
        const minutes = Math.floor(
          (new Date() - this.trendCreatedAt[woeid][trend.name]) / (60 * 1000)
        );
        if (minutes > 60) {
          if (!newTrendData[trend.name]) {
            console.log(`Decreased for ${trend.name}`);
            ranker[trend.name]--;
            trend.state = "dec";
          } else {
            ranker[trend.name]++;
            trend.state = "inc";
          }
        }
      });
    }

    if (!this.list[woeid]) {
      this.list[woeid] = slimmed;
    } else {
      this.list[woeid] = _.unionWith(
        this.list[woeid],
        slimmed,
        this.comparator
      );
    }

    this.trendsHash[woeid] = crypto
      .createHash("md5")
      .update(JSON.stringify(this.list[woeid]))
      .digest("hex");
    this.refreshTimestamp(woeid, this.list[woeid]);

    this.timestamp[woeid] = new Date();
  };

  englishFilter = (list) => {
    const deletedFromList = _.remove(list, (trend) => !isEnglish(trend.name));
    console.log(`~~~Eng Filter Removed : ${deletedFromList.length} trends!~~~`);
  };

  provideCurrentHash = (woeid) =>
    this.trendsHash[woeid] ? this.trendsHash[woeid] : "null";

  refreshTimestamp = (woeid, trendsList) => {
    trendsList.forEach((trend) => {
      if (this.trendCreatedAt[woeid][trend.name]) {
        const minutes = Math.floor(
          (new Date() - this.trendCreatedAt[woeid][trend.name]) / (60 * 1000)
        );
        trend.ETA = minutes;
        if (minutes >= 60) {
          trend.since = this.time_convert(minutes);
        } else {
          if (minutes == 0) {
            trend.since = `just now`;
          } else {
            trend.since = `${minutes} mins`;
          }
        }
      } else {
        this.trendCreatedAt[woeid][trend.name] = new Date();
        trend.since = `just now`;
      }
    });
  };

  optimizeTrends = (woeid, trendsList) => {
    const removed = [];
    let deleteNameSet = new Set();

    Object.keys(this.ranking[woeid]).forEach((name) => {
      if (this.ranking[woeid][name] <= -2) {
        removed.push(name);
        deleteNameSet.add(name);
        delete this.trendCreatedAt[woeid][name];
        delete this.ranking[woeid][name];
      }
    });

    const deletedFromList = _.remove(trendsList, (trend) =>
      deleteNameSet.has(trend.name)
    );

    console.log("Optimized Ranker ---->");
    console.log(this.ranking[woeid]);
    console.log("+++++++");
    console.log("Removed :");
    console.log(removed);
    console.log(deletedFromList);
    console.log("--------");
  };

  sortComparator = (a, b) =>
    this.ranking[this.tempId][b.name] - this.ranking[this.tempId][a.name];

  getTrends = (woeid, limit) => {
    helperUtils.bubbleRanker(this.list[woeid], this.ranking[woeid]);
    // this.tempId = woeid;
    // this.list[woeid].sort(this.sortComparator);
    let trimmedList = this.list[woeid].slice(0, limit);
    let minutes = Math.floor(
      (new Date() - this.timestamp[woeid]) / (60 * 1000)
    );
    if (minutes > 60) {
      trimmedList = helperUtils.fillWithNewerTrends(
        this.list[woeid],
        trimmedList
      );
    }

    console.log("**************************");
    trimmedList.forEach((tr) =>
      console.log(`[${tr.name} : ${this.ranking[woeid][tr.name]}]`)
    );

    return trimmedList;
  };

  isOneDayCompleted = (serverDate) => {
    let isSafe = false;
    const diifDate = (new Date() - serverDate) / (24 * 60 * 60 * 1000);
    if (diifDate > 1) {
      isSafe = true;
    }

    return isSafe;
  };

  time_convert = (num) => {
    let hours = Math.floor(num / 60);
    let minutes = num % 60;
    return `${hours} hours and ${minutes} mins`;
  };
}

module.exports = Trends;
