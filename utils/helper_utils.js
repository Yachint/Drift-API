const _ = require("lodash");

const comparator = (trend_a, trend_b) => trend_a.name === trend_b.name;

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

// const compare = (a, b) => ranker[b.name] - ranker[a.name];
// const combined = _.unionWith(array_a, array_b, comparator);
// console.log(combined);

// combined.sort(compare);
// console.log(combined);

exports.bubbleRanker = bubbleRanker;