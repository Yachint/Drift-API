const express = require("express");
require("dotenv").config();
const commonHeaders = require("./middleware/common-headers");
const app = express();
const TrendsModel = require("./models/trends-model");
const autoPinger = require("./utils/auto-ping");
const trendsRoutes = require("./routes/trends-routes");
const trends = new TrendsModel();
const startTime = new Date();

app.set("trends", trends);
app.use(express.json());
app.use(commonHeaders);
app.disable("etag").disable("x-powered-by");

app.use("/api/v1/trends", trendsRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Started Drift API ! at : ${port}`);
  console.log(`Started at : ${startTime}`);
  app.set("start-time", startTime);
});
