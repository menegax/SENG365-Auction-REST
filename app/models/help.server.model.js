const db = require('../../config/db');

exports.authenticate = function(userId, token, done) {
    db.get_pool().query(`UPDATE auction_user SET user_token = "${token}" WHERE user_id = "${userId}"`, function (err) {
        if (err) return done(err);
        return null;
    });
}