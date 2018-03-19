const db = require('../../config/db');

//view auctions, sorted from most recent to least recent
exports.getAll = function(done) {
    db.get_pool().query('SELECT auction_id AS id, category_title AS categoryTitle, auction_categoryid AS categoryId, ' +
        'auction_title AS title, auction_reserveprice AS reservePrice, auction_startingdate AS startDateTime, ' +
        'auction_endingdate AS endDateTime, MAX(bid_amount) AS currentBid FROM auction A JOIN category C ON ' +
        '(A.auction_categoryid = C.category_id) LEFT OUTER JOIN bid B ON (A.auction_id = B.bid_auctionid) GROUP BY auction_id', function(err, rows) {
        if (err) return done({"ERROR": "Error selecting"});

        return done(rows);
    });
};

//create auction
exports.insert = function(auction, done) {
    let values = [auction];

    db.get_pool().query('INSERT INTO auction (auction_categoryid, auction_title) VALUES ?', values, function(err, result) {
        if (err) return done({"ERROR": "Error selecting"});

        done(result);
    });
};

//view auction details
exports.getOne = function(auctionId, done) {
    db.get_pool().query('SELECT * FROM auction WHERE auction_id = ?', auctionId, function(err, rows) {
        if (err) return done(err);
        done(rows);
    });
};

//change some selected information for an Auction
exports.alter = function(done) {
    return null;
};

//view bid history
exports.view = function(auctionId, done) {
    db.get_pool().query('SELECT * FROM bid WHERE bid_auctionid = ? ', auctionId,  function(err, rows) {
        if (err) return done(err);
        done(rows);
    });
};

//make bid on auction
exports.make = function(done) {
    return null;
};