const db = require('../../config/db'),
        help = require('../models/help.server.model');

//create user with required fields
exports.insert = function(user_data, done) {
    let values = [user_data];

    db.get_pool().query('INSERT INTO auction_user (user_username, user_givenname, user_familyname, user_email, user_password) VALUES ?', values, function(err, result) {
        if (err) return done(err);

        done(result);
    });
};

//login user with username or email
exports.signIn = function(values, done) {
    if (values[1] == null && values[0] != null) {
        db.get_pool().query(`SELECT user_id AS id FROM auction_user WHERE user_password = "${values[2]}" AND user_username = "${values[0]}"`, function (err, rows) {
            if (err) return done(err);
            let token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
            help.authenticate(rows[0].id, token, function(result) {
                res.json(result);
            });
            done({"id": rows[0].id, "token": token});
        });
    } else if ((values[0] == null && values[1] != null) || (values[0] != null && values[1] != null)) {
        db.get_pool().query(`SELECT user_id AS id FROM auction_user WHERE user_password = "${values[2]}" AND user_email = "${values[1]}"`, function (err, rows) {
            if (err) return done(err);
            let token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
            done({"id": rows[0].id, "token": token});
        });
    }
};

//logout user
exports.signOut = function(done) {
    db.get_pool().query(`UPDATE auction_user SET user_token = NULL WHERE user_token = "${token}"`, function (err) {
        if (err) return done(err);
        return null;
    });
};

//view auction user, found by user id
exports.getOne = function(userId, done) {
    db.get_pool().query('SELECT user_username AS username, user_givenname AS givenName, user_familyname AS familyName, ' +
        'user_email AS email, FLOOR(user_accountbalance) AS accountBalance FROM auction_user WHERE user_id = ?', userId, function(err, rows) {
        if (err) return done(err);
        done(rows);
    });
};

//update user with this user id
exports.alter = function(userId, done) {
    return null;
};