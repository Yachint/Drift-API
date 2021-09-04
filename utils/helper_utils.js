const _ = require("lodash");

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const tweetDateFormatter = (tweets) => {
  tweets.forEach((tweet) => {
    tweet.createdAt = tweet.createdAt.substring(4, 16);
  });
};

const commaSeperator = (arr) => {
  var str = "";
  arr.forEach((id) => {
    str = str + "," + id;
  });
  str = str.substring(1, str.length);
  return str;
};

const textPopulator = (v2Tweets, v1Tweets) => {
  const textKeyMap = {};

  v2Tweets.forEach((tweet) => {
    textKeyMap[tweet.id] = tweet.text;
  });

  v1Tweets.forEach((tweet) => {
    let text = textKeyMap[tweet.id];
    let link = "";
    let idx = text.indexOf("https://t.co/");
    if (idx !== -1) {
      link = text.substring(idx, text.length);
      text = text.substring(0, idx);
    }
    tweet.text = text;
    tweet.link = link;
  });
};

const mediaPopulator = (v2Tweets, v2Media, v1Tweets) => {
  const mediaKeyMap = {};
  const urlKeyMap = {};

  v2Tweets.forEach((tweet) => {
    if (tweet.attachments) {
      mediaKeyMap[tweet.attachments.media_keys[0]] = tweet.id;
    }
  });
  console.log("Media key map :", mediaKeyMap);

  v2Media.forEach((media) => {
    urlKeyMap[mediaKeyMap[media.media_key]] = {
      type: media.type,
      link: media.url,
    };
  });

  console.log("UrlKeyMap: ", urlKeyMap);

  v1Tweets.forEach((tweet) => {
    if (urlKeyMap[tweet.id]) {
      tweet.media.type = urlKeyMap[tweet.id].type;
      tweet.media.link = urlKeyMap[tweet.id].link;
    }
  });
};

const tweetConstructor = (arr) => {
  const tweets = [];
  //replace "_normal" from profile pic url for better resolution

  arr.forEach((bloatedTweet) => {
    let slimTweet = {
      createdAt: bloatedTweet.created_at,
      id: bloatedTweet.id_str,
      text: bloatedTweet.text,
      retweets: bloatedTweet.retweet_count,
      likes: bloatedTweet.favorite_count,
      link: "",
      media: {
        type: "null",
        link: "null",
      },
      user: {
        userId: bloatedTweet.user.id,
        name: bloatedTweet.user.name,
        username: bloatedTweet.user.screen_name,
        location: bloatedTweet.user.location,
        followersCount: bloatedTweet.user.followers_count,
        followingCount: bloatedTweet.user.friends_count,
        verified: bloatedTweet.user.verified,
        profileImage: bloatedTweet.user.profile_image_url,
        profileBannerImage: bloatedTweet.user.profile_banner_url,
      },
    };

    tweets.push(slimTweet);
  });

  return tweets;
};

const array_a = [
  {
    name: "Yachint",
    state: "inc",
  },
  {
    name: "Prakhar",
    state: "dec",
  },
  {
    name: "Vaibhav",
    state: "new",
  },
];

const array_b = [
  {
    name: "Yachint",
    state: "new",
  },
  {
    name: "Prakhar",
    state: "new",
  },
  {
    name: "Iglesias",
    state: "new",
  },
];

const ranker = {
  Yachint: 6,
  Prakhar: 8,
  Vaibhav: 4,
  Iglesias: 5,
};

const bubbleRanker = (arr, ranker) => {
  let n = arr.length;
  for (var i = 0; i < n - 1; i++) {
    if (ranker[arr[i].name] < ranker[arr[i + 1].name]) {
      var temp = arr[i];
      arr[i] = arr[i + 1];
      arr[i + 1] = temp;
    }
  }
};

const trendTimeComparator = (a, b) => {
  return a.ETA - b.ETA;
};

const fillWithNewerTrends = (list, trimmedList) => {
  console.log("including New ones ~~~~~~");
  let newList = [];
  _.remove(trimmedList, (trend) => trend.state === "new");
  list.forEach((trend) => {
    if (trend.state === "new" && trend.ETA < 5) {
      newList.push(trend);
    }
  });
  newList.sort(trendTimeComparator);
  newList = newList.slice(0, 3);
  newList.push(...trimmedList);
  return newList;
};

// const compare = (a, b) => ranker[b.name] - ranker[a.name];
// const combined = _.unionWith(array_a, array_b, comparator);
// console.log(combined);

// combined.sort(compare);
// console.log(combined);
// commaSeperator(["2133", "3234", "5554", "9854", "5410984"]);

exports.bubbleRanker = bubbleRanker;
exports.asyncForEach = asyncForEach;
exports.fillWithNewerTrends = fillWithNewerTrends;
exports.commaSeperator = commaSeperator;
exports.tweetConstructor = tweetConstructor;
exports.mediaPopulator = mediaPopulator;
exports.textPopulator = textPopulator;
exports.tweetDateFormatter = tweetDateFormatter;
