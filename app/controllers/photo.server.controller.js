const Photo = require('../models/photo.server.model');

//get auction photo
exports.retrieve = function(req, res){
    let auctionId = req.params.auctionId;
    Photo.getOne(res, auctionId, function(statusCode, statusMessage, result) {
        res.status(statusCode);
        // .header('Content-Type', 'image/png').end(result);
        res.statusMessage = statusMessage;
        res.json(result);
        // res.header('Content-Type', 'image/png');
    });
};

//add a photo to an auction
exports.add = function(req, res){
    let auth = req.get('X-Authorization');
    let auctionId = req.params.auctionId;
    let contentType = req.get('Content-type');

    Photo.insert(req, auctionId, contentType, auth, function(statusCode, statusMessage, result) {
        res.status(statusCode);
        res.statusMessage = statusMessage;
        res.json(result);
    });
};

//delete a photo to an auction
exports.remove = function(req, res){
    let auth = req.get('X-Authorization');
    let auctionId = req.params.auctionId;
    Photo.unpublish(auth, auctionId, function(statusCode, statusMessage, result) {
        res.status(statusCode);
        res.statusMessage = statusMessage;
        res.json(result);
    });
};