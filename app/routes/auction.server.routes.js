const auctions = require('../controllers/auction.server.controller');

module.exports = function(app) {
    app.route('/api/v1/auctions')
        .get(auctions.list)
        .post(auctions.create);

    app.route('/api/v1/auctions/:auctionId')
        .get(auctions.read)
        .patch(auctions.update);

    app.route('/api/v1/auctions/:auctionId/bids')
        .get(auctions.history)
        .post(auctions.bid);
};