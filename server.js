const db = require('./config/db'),
    express = require('./config/express');

const app = express();

//Connect to MySQL on start
db.connect(function(err) {
    if (err) {
        console.log('Unable to connect to MySQL.');
        process.exit(1);
    } else {
        app.listen(3000, function() {
            console.log('Listening on port: ' + 3000);
        });
    }
});

console.log("http://127.0.0.1:3000/api/v1/auctions");
