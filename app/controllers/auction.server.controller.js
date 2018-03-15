const Auction = require('../models/auction.server.model');

//view auctions, sorted from most recent to least recent
exports.list = function(req, res){
    Auction.getAll(function(result) {
        res.json(result);
    });
};

//create auction
exports.create = function(req, res) {
    let auction_data = {
        "auction_title": req.body.auction_title
    };

    let title = auction_data['auction_title'].toString();

    let values = [
        [auction_title]
    ];

    Auction.insert(values, function(result) {
        res.json(result);
    });
};

//view auction details
exports.read = function(req, res){
    return null;
};

//change some selected information about an Auction
exports.update = function(req, res){
    return null;
};

//view bid history
exports.history = function(req, res){
    return null;
};

//make bid on auction
exports.bid = function(req, res){
    return null;
};