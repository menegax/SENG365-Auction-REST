const db = require('../../config/db'),
    fs = require('fs'),
    path = require('path'),
    appDir = "\\images\\",
    filePath = path.dirname(require.main.filename);

//get an auction photo
exports.getOne = function(res, auctionId, done) {
    db.get_pool().query(`SELECT * FROM auction WHERE auction_id = "${auctionId}"`, function(err, rows) {
        if (err) return done(500, "Internal server error", err);
        db.get_pool().query(`SELECT photo_image_URI AS URI FROM photo WHERE photo_auctionid = "${auctionId}"`, function (err, rows) {
            if (err) return done(500, "Internal server error", err);
            console.log(rows.length);
            if (rows.length !== 0) {
                if (fs.existsSync(`./images/${auctionId}.png`)) {
                    res.header('Content-type', 'image/png');
                } else {
                    res.header('Content-type', 'image/jpeg');
                }
                done(200, "OK", filePath + appDir + rows[0].URI);
            } else {
                done(404, "Not found", {"ERROR": "Auction with given id does not exist"});
            }
        });
    });
};

//add a photo to an auction
exports.insert = function(req, auctionId, contentType, auth, done) {
    db.get_pool().query(`SELECT user_id AS id FROM auction_user WHERE user_token = "${auth}"`, function (err, rows) {
        if (err) return done(500, "Internal server error", err);
        if (rows.length === 0) return done(401, "Unauthorized", {"ERROR": "You are unauthorized!"});
        db.get_pool().query(`SELECT * FROM auction WHERE auction_id = "${auctionId}"`, function (err, rows) {
            if (err) return done(500, "Internal server error", err);
            if (rows.length === 0) return done(404, "Not found", {"ERROR": "The auction with given auction id does not exist"});
            db.get_pool().query(`SELECT user_id AS id, auction_startingdate AS date FROM auction_user JOIN auction ON (user_id = auction_userid) WHERE user_token = "${auth}" AND auction_id = "${auctionId}"`, function (err, rows) {
                if (err) return done(500, "Internal server error", err);
                if (rows.length === 0) return done(401, "Unauthorized", {"ERROR": "You are unauthorized"});
                let now = new Date();
                if (Date.parse(rows[0].date) < now) return done(400, "Bad request.", {"ERROR": "The bid has already started"});
                let URI;
                if (contentType === "image/jpeg") {
                    URI = `${auctionId}.jpeg`;
                } else if (contentType = `image/png`) {
                    URI = `${auctionId}.png`
                }
                db.get_pool().query(`INSERT INTO photo (photo_auctionid, photo_image_URI) VALUES (?, ?) ON DUPLICATE KEY UPDATE photo_image_URI = ?`,
                    [auctionId, URI, URI], function (err) {
                    if (err) return done(500, "Internal server error", err);
                    if ((contentType === "image/png") && (!fs.existsSync(`./images/${auctionId}.jpeg`))) {
                        req.pipe(fs.createWriteStream(`./images/${auctionId}.png`));
                        return done(201, "OK", {"SUCCESSFUL": "SUCCESSFULLY uploaded a .png photo"});
                    } else if ((contentType === "image/jpeg") && (!fs.existsSync(`./images/${auctionId}.png`))) {
                        req.pipe(fs.createWriteStream(`./images/${auctionId}.jpeg`));
                        return done(201, "OK", {"SUCCESSFUL": "SUCCESSFULLY uploaded a .jpeg photo"});
                    } else {
                        return done(400, "Bad request.", {"ERROR": "The image is not png or jpeg or you are trying to overwrite photo"});
                    }
                });
            });
        });
    });
};

//delete a photo to an auction
exports.unpublish = function(auth, auctionId, done) {
    db.get_pool().query(`SELECT user_id AS id FROM auction_user WHERE user_token = "${auth}"`, function (err, rows) {
        if (err) return done(500, "Internal server error", err);
        if (rows.length === 0) return done(401, "Unauthorized", {"ERROR": "You are unauthorized!"});
        db.get_pool().query(`SELECT auction_startingdate AS date FROM auction WHERE auction_id = "${auctionId}"`, function (err, result) {
            if (err) return done(500, "Internal server error", err);
            let now = new Date();
            if (result[0].date < now) return done(400, "Bad request.", {"ERROR": "The bid has already started"});
            db.get_pool().query(`SELECT photo_image_URI AS photo FROM photo WHERE photo_auctionid = "${auctionId}"`, function (err, rows) {
                if (err) return done(500, "Internal server error", err);
                db.get_pool().query(`DELETE FROM photo WHERE photo_auctionid = "${auctionId}"`, function (err, result) {
                    if (err) return done(500, "Internal server error", err);
                    try {
                        fs.unlink(filePath + appDir + rows[0].photo, function (err) {
                            if (err) return done(500, "Internal server error", err);
                            done(200, "OK", {"SUCCESS": "Successful deletion"});
                        })
                    } catch (Exception) {
                        done(404, "Not found", {"ERROR": "No such file or directory"});
                    }
                });
            });
        });
    });
};