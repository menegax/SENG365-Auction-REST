const db = require('../../config/db');

//view auctions, sorted from most recent to least recent
exports.getAll = function(done) {
    db.get_pool().query('SELECT auction_id AS id, category_title AS categoryTitle, auction_categoryid AS categoryId, ' +
        'auction_title AS title, auction_reserveprice AS reservePrice, auction_startingdate AS startDateTime, ' +
        'auction_endingdate AS endDateTime, MAX(bid_amount) AS currentBid FROM auction A JOIN category C ON ' +
        '(A.auction_categoryid = C.category_id) LEFT OUTER JOIN bid B ON (A.auction_id = B.bid_auctionid) GROUP BY auction_id', function(err, rows) {
        if (err) return done(500, "Internal server error", err);

        return done(200, "OK", rows);
    });
};

//create auction
exports.insert = function(auction, done) {
    db.get_pool().query(`SELECT user_id as id FROM auction_user WHERE user_token IS NOT NULL`, function (err, rows) {
        if (err) return done(500, "Internal server error", err);
        if (rows.length == 0) return done(401, "Unauthorized", {"ERROR": "You are unauthorized!"});
        let userId = rows[0].id;
        auction[0].push(userId);
        let dateTime = new Date();
        auction[0].push(dateTime.toISOString())
        let values = [auction];
        db.get_pool().query('INSERT INTO auction (auction_categoryid, auction_title, auction_description, auction_startingdate, auction_endingdate, ' +
            'auction_reserveprice, auction_startingprice, auction_userid, auction_creationdate) VALUES ?', values, function (err, result) {
            if (err) return done(500, "Internal server error", err);

            done(200, "OK", {"id": result.insertId});
        });
    });
};

//view auction details
exports.getOne = function(auctionId, done) {
    db.get_pool().query(`SELECT * FROM auction_user WHERE user_token IS NOT NULL`, function(err, rows) {
        if (err) return done(500, "Internal server error", err);
        if (rows.length == 0) return done(401, "Unauthorized", {"ERROR": "You are unauthorized!"});

        db.get_pool().query(`SELECT auction_categoryid AS categoryId, category_title AS categoryTitle, auction_title AS title, 
        auction_reserveprice AS reservePrice, auction_startingdate AS startDateTime, auction_endingdate AS endDateTime, auction_description
         AS description, auction_creationdate AS creationDateTime, auction_userid AS id, auction_startingprice AS startingBid 
         FROM auction JOIN category ON (auction_categoryid = category_id) WHERE auction_id = "${auctionId}"`, function (err, rows) {
            if (err) return done(500, "Internal server error", err);
            if (rows.length == 0) return done(404, "Not found", {"ERROR": "The auction with given id could not be found"});
            let categoryId = rows[0].categoryId;
            let categoryTitle = rows[0].categoryTitle;
            let title = rows[0].title;
            let reservePrice = rows[0].reservePrice;
            let startDateTime = rows[0].startDateTime;
            let endDateTime = rows[0].endDateTime;
            let description = rows[0].description;
            let creationDateTime = rows[0].creationDateTime;
            let id = rows[0].id;
            let startingBid = rows[0].startingBid;
            db.get_pool().query(`SELECT user_username AS username FROM auction_user JOIN auction ON (user_id = auction_userid)
             WHERE auction_id = "${auctionId}"`, function (err, rows) {
                if (err) return done(500, "Internal server error", err);
                let username = rows[0].username;

                db.get_pool().query(`SELECT MAX(FLOOR(bid_amount)) AS currentBid FROM bid WHERE bid_auctionid = "${auctionId}"`, function (err, rows) {
                    if (err) return done(500, "Internal server error", err);
                    let currentBid = rows[0].currentBid

                    db.get_pool().query(`SELECT bid_amount AS amount, bid_datetime AS datetime, bid_userid AS buyerId, user_username AS username 
                    FROM bid JOIN auction_user ON (bid_userid = user_id) WHERE bid_auctionid = "${auctionId}"`, function (err, rows) {
                        if (err) return done(500, "Internal server error", err);
                        console.log(rows.length);
                        done(200, "OK", {
                            "categoryId": categoryId,
                            "categoryTitle": categoryTitle,
                            "title": title,
                            "reservePrice": reservePrice,
                            "startDateTime": startDateTime,
                            "endDateTime": endDateTime,
                            "description": description,
                            "creationDateTime": creationDateTime,
                            "seller": {"id": id, "username": username},
                            "startingBid": startingBid,
                            "currentBid": currentBid,
                            "bids": rows
                        });
                    });
                });
            });

        });
    });
};

//change some selected information for an Auction
exports.alter = function(done) {
    return null;
};

//view bid history
exports.view = function(auctionId, done) {
    db.get_pool().query('SELECT bid_amount AS amount, bid_datetime AS datetime, bid_userid AS buyerId, user_username AS buyerUsername' +
        ' FROM bid Join auction_user ON (bid_userid = user_id) WHERE bid_auctionid = ? ', auctionId,  function(err, rows) {
        if (err) return done(500, "Internal server error", err);
        if (rows.length == 0) return done(404, "Not found", {"ERROR": "There is not bid history associated with this auction id"});
        done(200, "OK", rows);
    });
};

//make bid on auction
exports.make = function(amount, bidTime, auctionId, done) {
    db.get_pool().query('SELECT user_id AS id FROM auction_user WHERE user_token IS NOT NULL', function(err, result) {
        if (err) return done(500, "Internal server error", err);
        let userId = result[0].id;
        db.get_pool().query(`SELECT MAX(FLOOR(bid_amount)) AS amount FROM bid WHERE bid_auctionid = "${auctionId}"`, function(err, result) {
            if (err) return done(500, "Internal server error", err);
            if (result.length == 0) return done(404, "Not found", {"ERROR": "Could not find the auction with given auction id"});
            if (result[0].amount > amount) {
                return done({"ERROR": "Your bid is too low"});
            }
            let bid = [
                [auctionId, amount, bidTime, userId]
            ];
            let values = [bid];
            db.get_pool().query('INSERT INTO bid (bid_auctionid, bid_amount, bid_datetime, bid_userid) VALUES ?', values, function (err, result) {
                if (err) return done(500, "Internal server error", err);

                done(200, "OK", {"SUCCESSFUL": "Successfully inserted bid"});
            });
        });
    });
};