const Auction = require('../models/auction.server.model'),
    URL = require('url').URL;

//view auctions, sorted from most recent to least recent
exports.list = function(req, res){
    let startIndex = req.query.startIndex;
    let count = req.query.count;
    let q = req.query.q;
    let categoryId = req.query.categoryId;
    let seller = req.query.seller;
    let bidder = req.query.bidder;

    Auction.getAll(startIndex, count, q, categoryId, seller, bidder, function(statusCode, statusMessage, result) {
        res.status(statusCode);
        res.statusMessage = statusMessage;
        res.json(result);
    });
};

//create auction
exports.create = function(req, res) {
    let auth = req.get('X-Authorization');
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

    let start = new Date();
    start.setTime(auction_startTime);
    let starting = start;

    let end = new Date();
    end.setTime(auction_endTime);
    let ending = end;

    let create = new Date();

    console.log(create);
    // create > auction_startTime ||
    if (auction_startTime >= auction_endTime || auction_reservePrice < 0 || auction_startBid < 0) {
        create = undefined;
    }
    let values = [
        [auction_categoryid, auction_title, auction_description, starting, ending, auction_reservePrice, auction_startBid]
    ];

    Auction.insert(auth, values, create, function(statusCode, statusMessage, result) {
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
    let id= req.params.auctionId;
    let auth = req.get('X-Authorization');
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

    let start = new Date();
    start.setTime(auction_startTime);
    let starting = start;

    let end = new Date();
    end.setTime(auction_endTime);
    let ending = end;

    let create = new Date();

    console.log(create);
    // create > auction_startTime ||
    if (auction_startTime >= auction_endTime || auction_reservePrice < 0 || auction_startBid < 0) {
        create = undefined;
    }

    Auction.alter(auth, id, auction_categoryid, auction_title, auction_description, starting, ending, auction_reservePrice, auction_startBid, create, function(statusCode, statusMessage, result) {
        res.status(statusCode);
        res.statusMessage = statusMessage;
        res.json(result);
    });
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
    let auth = req.get('X-Authorization');
    let id= req.params.auctionId;

    let amount = req.query.amount;
    let dateTime = new Date();
    let bidTime = dateTime.toISOString();

    Auction.make(auth, amount, bidTime, id, function(statusCode, statusMessage, result) {
        res.status(statusCode);
        res.statusMessage = statusMessage;
        res.json(result);
    });
};