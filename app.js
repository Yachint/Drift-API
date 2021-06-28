const express = require('express');
require('dotenv').config();
const commonHeaders = require('./middleware/common-headers');
const app = express();

app.use(express.json());
app.use(commonHeaders);
app.disable('etag').disable('x-powered-by');

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Started Drift API ! at : ${port}`);
});