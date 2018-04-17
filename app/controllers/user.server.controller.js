const User = require('../models/user.server.model'),
    URL = require('url').URL;

//create user
exports.create = function(req, res){
    let user_data = {
        "username": req.body.username,
        "givenName": req.body.givenName,
        "familyName": req.body.familyName,
        "email": req.body.email,
        "password": req.body.password
    };

    let user_username = user_data['username'];
    let user_givenname = user_data['givenName'];
    let user_familyname = user_data['familyName'];
    let user_email = user_data['email'];
    let user_password = user_data['password'];

    let contains = user_email.includes("@");

    if (contains === true) {contains = user_password.length > 0; }

    let values = [
        [user_username, user_givenname, user_familyname, user_email, user_password]
    ];

    User.insert(values, contains, function(statusCode, statusMessage, result) {
        res.status(statusCode);
        res.statusMessage = statusMessage;
        res.json(result);
    });
};

//logs user into the system. One of username and email is required
exports.login = function(req, res){
    let user_username = req.query.username;
    let user_email = req.query.email;
    let user_password = req.query.password;

    let values = [user_username, user_email, user_password];

    User.signIn(values, function(statusCode, statusMessage, result) {
        res.status(statusCode);
        res.statusMessage = statusMessage;
        res.json(result);
    });
};

//logs out user session given by auth token in header
exports.logout = function(req, res){
    let auth = req.get('X-Authorization');
    User.signOut(auth, function(statusCode, statusMessage, result) {
        res.status(statusCode);
        res.statusMessage = statusMessage;
        res.json(result);
    });
};

//get user by user id(only if logged on as this user)
exports.read = function(req, res){
    let id= req.params.userId;
    let auth = req.get('X-Authorization');
    User.getOne(id, auth, function(statusCode, statusMessage, result) {
        res.status(statusCode);
        res.statusMessage = statusMessage;
        res.json(result);
    });
};

//update user
exports.update = function(req, res){
    let auth = req.get('X-Authorization');
    let user_data = {
        "username": req.body.username,
        "givenName": req.body.givenName,
        "familyName": req.body.familyName,
        "email": req.body.email,
        "password": req.body.password
    };

    let username = user_data['username'];
    let givenName = user_data['givenName'];
    let familyName = user_data['familyName'];
    let email = user_data['email'];
    let password = user_data['password'];

    let id= req.params.userId;
    User.alter(auth, id, username, givenName, familyName, email, password, function(statusCode, statusMessage, result) {
        res.status(statusCode);
        res.statusMessage = statusMessage;
        res.json(result);
    });
};