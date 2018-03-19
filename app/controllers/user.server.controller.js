const User = require('../models/user.server.model');

//create user
exports.create = function(req, res){
    let user_data = {
        "userName": req.body.userName,
        "givenName": req.body.givenName,
        "familyName": req.body.familyName,
        "email": req.body.email,
        "password": req.body.password
    };

    let user_username = user_data['userName'];
    let user_givenname = user_data['givenName'];
    let user_familyname = user_data['familyName'];
    let user_email = user_data['email'];
    let user_password = user_data['password'];

    let values = [
        [user_username, user_givenname, user_familyname, user_email, user_password]
    ];

    User.insert(values, function(result) {
        res.json(result);
    });
};

//logs user into the system. One of username and email is required
exports.login = function(req, res){
    let user_data = {
        "userName": req.body.userName,
        "email": req.body.email,
        "password": req.body.password
    };

    let user_username = user_data['userName'];
    let user_email = user_data['email'];
    let user_password = user_data['password'];

    let values = [user_username, user_email, user_password];

    User.signIn(values, function(result) {
        res.json(result);
    });
};

//logs out user session given by auth token in header
exports.logout = function(req, res){
    User.signOut(function(result) {
        res.json(result);
    });
};

//get user by user id(only if logged on as this user)
exports.read = function(req, res){
    let id= req.params.userId;
    User.getOne(id, function(result){
        res.json(result);
    });
};

//update user
exports.update = function(req, res){
    let id= req.params.userId;
    User.alter(id, function(result){
        res.json(result);
    });
};