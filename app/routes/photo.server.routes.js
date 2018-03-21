const photos = require('../controllers/photo.server.controller');

module.exports = function(app) {
    app.route('/api/v1/auctions/:auctionId/photos')
        .get(photos.retrieve)
        .post(photos.add)
        .delete(photos.remove);
};