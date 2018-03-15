const db = require('../../config/db');

//view auctions, sorted from most recent to least recent
exports.getAll = function(done) {
    db.get_pool().query('SELECT * FROM auction', function(err, rows) {
        if (err) return done({"ERROR": "Error selecting"});

        return done(rows);
    })
};

//create auction
exports.insert = function(auction_title, done) {
    let values = [auction_title];

    db.get_pool().query('INSERT INTO auction (auction_title) VALUES ?', values, function(err, result) {
        if (err) return done(err);

        done(result);
    });
};

//view auction details
exports.getOne = function(done) {
    return null;
};

//change some selected information for an Auction
exports.alter = function(done) {
    return null;
};

//view bid history
exports.view = function(done) {
    return null;
};

//make bid on auction
exports.make = function(done) {
    return null;
};