const Auction = require('../models/auction.server.model'),
    URL = require('url').URL;

//view auctions, sorted from most recent to least recent
exports.list = function(req, res){
    Auction.getAll(function(statusCode, statusMessage, result) {
        res.status(statusCode);
        res.statusMessage = statusMessage;
        res.json(result);
    });
};

//create auction
exports.create = function(req, res) {
    let auction_data = {
        "categoryId": req.body.categoryId,
        "title": req.body.title,
        "description": req.body.description,
        "startDateTime": req.body.startDateTime,
        "endDateTime": req.body.endDateTime,
        "reservePrice": req.body.reservePrice,
        "startingBid": req.body.startingBid
    };

    let auction_categoryid = auction_data['categoryId'];
    let auction_title = auction_data['title'];
    let auction_description = auction_data['description'];
    let auction_startTime = auction_data['startDateTime'];
    let auction_endTime = auction_data['endDateTime'];
    let auction_reservePrice = auction_data['reservePrice'];
    let auction_startBid = auction_data['startingBid'];

    let values = [
        [auction_categoryid, auction_title, auction_description, auction_startTime, auction_endTime, auction_reservePrice, auction_startBid]
    ];

    Auction.insert(values, function(statusCode, statusMessage, result) {
        res.status(statusCode);
        res.statusMessage = statusMessage;
        res.json(result);
    });
};

//view auction details
exports.read = function(req, res){
    let id= req.params.auctionId;
    Auction.getOne(id, function(statusCode, statusMessage, result) {
        res.status(statusCode);
        res.statusMessage = statusMessage;
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
    Auction.view(id, function(statusCode, statusMessage, result) {
        res.status(statusCode);
        res.statusMessage = statusMessage;
        res.json(result);
    });
};

//make bid on auction
exports.bid = function(req, res){
    let id= req.params.auctionId;

    let amount = req.query.amount;
    // const parameters = new URL(req.url, 'http://localhost').searchParams.toString();
    // let params = parameters.split("&");
    // let price;
    // for (i = 0; i < params.length; i++) {
    //     if (params[i].substring(0, 6).valueOf() == new String('amount').valueOf()) {
    //         price = params[i].split("=");
    //     }
    // }
    // let amount = price[1];
    let dateTime = new Date();
    let bidTime = dateTime.toISOString();

    Auction.make(amount, bidTime, id, function(statusCode, statusMessage, result) {
        res.status(statusCode);
        res.statusMessage = statusMessage;
        res.json(result);
    });
};