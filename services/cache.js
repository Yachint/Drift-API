const redis = require("redis");
const util = require("util");

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
client.get = util.promisify(client.get).bind(client);

const getMulti = async (hashKey, key) => {
  const cacheValue = await client.hget(hashKey, key);

  if (!cacheValue) {
    return {
      errors: true,
      result: null,
    };
  }

  return {
    errors: false,
    result: JSON.parse(cacheValue),
  };
};

const getSingle = async (key) => {
  const cacheValue = await client.get(key);

  if (!cacheValue) {
    return {
      errors: true,
      result: null,
    };
  }

  return {
    errors: false,
    result: JSON.parse(cacheValue),
  };
};

const setMulti = (hashKey, key, res) => {
  client.hset(hashKey, key, JSON.stringify(res));
};

const setSingle = (key, res, exp_time) => {
  client.set(key, JSON.stringify(res), "EX", exp_time);
};

const clearCache = (hashKey) => {
  client.del(JSON.stringify(hashKey));
};

exports.getMulti = getMulti;
exports.setMulti = setMulti;
exports.setSingle = setSingle;
exports.getSingle = getSingle;
exports.clearCache = clearCache;
