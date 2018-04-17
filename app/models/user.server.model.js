const db = require('../../config/db');

//create user with required fields
exports.insert = function(user_data, contains, done) {
    if (contains === false) {
        return done(400, "Malformed request", {"ERROR": "The user does not have valid email address or password"});
    }
    let values = [user_data];

    db.get_pool().query('INSERT INTO auction_user (user_username, user_givenname, user_familyname, user_email, user_password) VALUES ?', values, function(err, result) {
        if (err) return done(500, "Internal server error", err);
        done(201, "OK", {"id": result.insertId});
    });
};

//login user with username or email
exports.signIn = function(values, done) {
    if (values[1] == null && values[0] != null) {
        db.get_pool().query(`SELECT user_id AS id FROM auction_user WHERE user_password = "${values[2]}" AND user_username = "${values[0]}"`, function (err, rows) {
            if (err) return done(500, "Internal server error.", err);
            if (rows.length === 0) return done(400, "Invalid username/email/password supplied", {"ERROR": "Invalid username/email/password supplied"});
            let token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
            db.get_pool().query(`UPDATE auction_user SET user_token = "${token}" WHERE user_id = "${rows[0].id}"`, function (err) {
                if (err) return done(500, "Internal server error", err);
                done(200, "OK", {"id": rows[0].id, "token": token});
            });
        });
    } else if ((values[0] == null && values[1] != null)) {
        // (values[0] != null && values[1] != null)
        db.get_pool().query(`SELECT user_id AS id FROM auction_user WHERE user_password = "${values[2]}" AND user_email = "${values[1]}"`, function (err, rows) {
            if (err) return done(500, "Internal server error.", err);
            if (rows.length === 0) return done(400, "Invalid username/email/password supplied", {"ERROR": "Invalid username/email/password supplied"});
            let token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
            db.get_pool().query(`UPDATE auction_user SET user_token = "${token}" WHERE user_id = "${rows[0].id}"`, function (err) {
                if (err) return done(500, "Internal server error", err);
                done(200, "OK", {"id": rows[0].id, "token": token});
            });
        });
    } else {
        db.get_pool().query(`SELECT user_id AS id FROM auction_user WHERE user_password = "${values[2]}" AND user_email = "${values[1]}"`, function (err, rows) {
            if (err) return done(500, "Internal server error.", err);
            if (rows.length === 0) {
                db.get_pool().query(`SELECT user_id AS id FROM auction_user WHERE user_password = "${values[2]}" AND user_username = "${values[0]}"`, function (err, rows) {
                    if (err) return done(500, "Internal server error.", err);
                    if (rows.length === 0) return done(400, "Invalid username/email/password supplied", {"ERROR": "Invalid username/email/password supplied"});
                    let token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
                    db.get_pool().query(`UPDATE auction_user SET user_token = "${token}" WHERE user_id = "${rows[0].id}"`, function (err) {
                        if (err) return done(500, "Internal server error", err);
                        done(200, "OK", {"id": rows[0].id, "token": token});
                    });
                });
            } else {
                let token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
                db.get_pool().query(`UPDATE auction_user SET user_token = "${token}" WHERE user_id = "${rows[0].id}"`, function (err) {
                    if (err) return done(500, "Internal server error", err);
                    done(200, "OK", {"id": rows[0].id, "token": token});
                });
            }
        });
    }
};

//logout user
exports.signOut = function(auth, done) {
    db.get_pool().query(`SELECT user_id as id FROM auction_user WHERE user_token = "${auth}"`, function (err, rows) {
        if (err) return done(500, "Internal server error", err);
        if (rows.length === 0) return done(401, "Unauthorized", {"ERROR": "You are unauthorized!"});

        let userId = rows[0].id;
        db.get_pool().query(`UPDATE auction_user SET user_token = NULL WHERE user_id = "${userId}"`, function (err, rows) {
            if (err) return done(500, "Internal server error", err);
            done(200, "OK", {"SUCCESSFULL": "Successfully logged out"});
        });
    });
};

//view auction user, found by user id
exports.getOne = function(userId, auth, done) {
    db.get_pool().query(`SELECT user_id as id FROM auction_user WHERE user_token = "${auth}"`, function (err, rows) {
        if (err) return done(500, "Internal server error", err);
        if (rows.length === 0) {
            db.get_pool().query('SELECT user_username AS username, user_givenname AS givenName, user_familyname AS familyName ' +
                'FROM auction_user WHERE user_id = ?', userId, function (err, rows) {
                if (err) return done(500, "Internal server error", err);
                if (rows.length === 0) return done(404, "Not found", {"ERROR": "User with given id was not found"});
                done(200, "OK", rows);
            });
        } else {
            if (rows[0].id.toString() === userId.toString()) {
                db.get_pool().query('SELECT user_username AS username, user_givenname AS givenName, user_familyname AS familyName, ' +
                    'user_email AS email, FLOOR(user_accountbalance) AS accountBalance FROM auction_user WHERE user_id = ?', userId, function (err, rows) {
                    if (err) return done(500, "Internal server error", err);
                    if (rows.length === 0) return done(404, "Not found", {"ERROR": "User with given id was not found"});
                    done(200, "OK", rows);
                });
            } else {
                db.get_pool().query('SELECT user_username AS username, user_givenname AS givenName, user_familyname AS familyName ' +
                    'FROM auction_user WHERE user_id = ?', userId, function (err, rows) {
                    if (err) return done(500, "Internal server error", err);
                    if (rows.length === 0) return done(404, "Not found", {"ERROR": "User with given id was not found"});
                    done(200, "OK", rows);
                });
            }
        }
    });
};

//update user with this user id
exports.alter = function(auth, userId, username, givenName, familyName, email, password, done) {
    db.get_pool().query(`SELECT user_id AS id FROM auction_user WHERE user_token = "${auth}"`, function(err, rows) {
        if (err) return done(500, "Internal server error", err);
        if (rows.length === 0) return done(401, "Unauthorized", {"ERROR": "You are unauthorized"});
        if (rows[0].id.toString() !== userId.toString()) return done(401, "Unauthorized", {"ERROR": "You are unauthorized"});
        if (username !== undefined || givenName !== undefined || familyName !== undefined || email !== undefined || password !== undefined) {
            if (username !== undefined) {
                db.get_pool().query(`UPDATE auction_user SET user_username = "${username}" WHERE user_id = "${userId}"`, function(err) {
                    if (err) return done(500, "Internal server error", err);
                });
            } if (givenName !== undefined) {
                db.get_pool().query(`UPDATE auction_user SET user_givenname = "${givenName}" WHERE user_id = "${userId}"`, function(err) {
                    if (err) return done(500, "Internal server error", err);
                });
            } if (familyName !== undefined) {
                db.get_pool().query(`UPDATE auction_user SET user_familyname = "${familyName}" WHERE user_id = "${userId}"`, function(err) {
                    if (err) return done(500, "Internal server error", err);
                });
            } if (email !== undefined) {
                db.get_pool().query(`UPDATE auction_user SET user_email = "${email}" WHERE user_id = "${userId}"`, function(err) {
                    if (err) return done(500, "Internal server error", err);
                });
            } if (password !== undefined) {
                db.get_pool().query(`UPDATE auction_user SET user_password = "${password}" WHERE user_id = "${userId}"`, function(err) {
                    if (err) return done(500, "Internal server error", err);
                });
            }
        } else {
            return done(400, "Malformed request", {"ERROR": "No valid values in request"});
        }
        return done(201, "OK", {"SUCCESSFUL": "Successfully updated user"});
    });
};