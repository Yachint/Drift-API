const _ = require("lodash");

const comparator = (trend_a, trend_b) => trend_a.name === trend_b.name;

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
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
  let nameSet = new Set();
  let newList = [];
  _.remove(trimmedList, (trend) => trend.state === "new");
  trimmedList.forEach((trend) => nameSet.add(trend.name));
  list.forEach((trend) => {
    if (trend.state === "new" && !nameSet.has(trend.name)) {
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

exports.bubbleRanker = bubbleRanker;
exports.asyncForEach = asyncForEach;
exports.fillWithNewerTrends = fillWithNewerTrends;
