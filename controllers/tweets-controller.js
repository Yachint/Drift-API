const twitterApi_V1 = require("../utils/twitter-api").Build();
const twitterApi_V2 = require("../utils/twitter-api-v2");
const helperUtils = require("../utils/helper_utils");
const cache = require("../services/cache");

const getTweets = async (req, res, next) => {
  const { term } = req.query;
  const { errors, result } = await cache.getSingle(term);

  if (errors) {
    const response = await twitterApi_V1.get("search/tweets.json", {
      params: {
        q: term,
        result_type: "popular",
        include_entities: "false",
      },
    });

    const idArray = [];
    let tweets = [];
    tweets = helperUtils.tweetConstructor(response.data.statuses);
    response.data.statuses.forEach((status) => idArray.push(status.id_str));
    let idsCommaSeparated = helperUtils.commaSeperator(idArray);

    const v2Response = await twitterApi_V2.get("tweets", {
      params: {
        ids: idsCommaSeparated,
        expansions: "attachments.media_keys",
        "media.fields": "url,public_metrics,preview_image_url",
      },
    });

    const tweetV2Data = v2Response.data.data;
    helperUtils.textPopulator(tweetV2Data, tweets);

    if (v2Response.data.includes !== undefined) {
      console.log("Media Present!");
      const tweetV2Media = v2Response.data.includes.media;
      helperUtils.mediaPopulator(tweetV2Data, tweetV2Media, tweets);
    }

    res.json({
      status: 200,
      message: "tweets fetched (FRESH)",
      data: tweets,
      errors: false,
    });

    cache.setSingle(term, tweets, 1800);
  } else {
    res.json({
      status: 200,
      message: "tweets fetched (CACHED)",
      data: result,
      errors: false,
    });
  }
};

exports.getTweets = getTweets;
