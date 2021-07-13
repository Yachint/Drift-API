const axios = require('axios');

module.exports = axios.default.create({
    baseURL: 'https://api.twitter.com/1.1/',
    headers : {
        "Authorization": `Bearer ${process.env.BEARER_TOKEN}`
    }
})