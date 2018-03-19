const db = require('../models/db.server.model');

// Force reset of database to original structure
exports.reset = function(req, res){
    db.clearTables(function(result) {
        res.json(result);
    });
};

// Reload sample data into reset database
exports.resample = function(req, res) {
    db.sampleData(function(result) {
        res.json(result);
    });
};