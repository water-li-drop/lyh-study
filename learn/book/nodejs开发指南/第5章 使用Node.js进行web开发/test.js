var https = require('https');

https.get("https://www.lagou.com/lbs/getAllCitySearchLabels.json", function(res) {
    console.log(res);
    console.log("Got response: " + res.statusCode);
}).on('error', function(e) {
    console.log("Got error: " + e.message);
});