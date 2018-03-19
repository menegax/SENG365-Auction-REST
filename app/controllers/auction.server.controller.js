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
        "categoryId": req.body.categoryId,
        "title": req.body.title
    };

    let auction_categoryid = auction_data['categoryId'];
    let auction_title = auction_data['title'];

    console.log(auction_categoryid);
    console.log(auction_title);

    let values = [
        [auction_categoryid, auction_title]
    ];

    Auction.insert(values, function(result) {
        res.json(result);
    });
};

//view auction details
exports.read = function(req, res){
    let id= req.params.auctionId;
    Auction.getOne(id, function(result){
        res.json(result);
    });
};

//change some selected information about an Auction
exports.update = function(req, res){
    return null;
};

//view bid history
exports.history = function(req, res){
    let id= req.params.auctionId;
    Auction.view(id, function(result){
        res.json(result);
    });
};

//make bid on auction
exports.bid = function(req, res){
    return null;
};