const db = require('../config/db'),
    fs = require('fs');

const resampleSQL = path.join('./load_data.sql');

//resets all tables and recreates
exports.clearTables = function(done) {
    let sql = fs.readFileSync('create_database.sql').toString();
    db.get_pool().query(sql, function(err, rows) {
        if (err) return done(err);
        return done("SUCCESSFULLY reset database");
    });
};

//uses sample sql script to fill tables with sample
exports.sampleData = function(done) {
    return null;
}







// const db = require('../config/db'),
//     path = require('path'),
//     fs = require('fs');
//
// const resetSQL = path.join('./create_database.sql');
// const resampleSQL = path.join('./load_data.sql');
//
// //resets all tables and recreates
// exports.clearTables = function(done) {
//     let readQuery = fs.readFilesSync(resetSQL, 'utf8');
//     db.get_pool().query(readQuery, function(err, rows) {
//         if (err) return done(err);
//         return done(rows);
//     });
// };
//
// //uses sample sql script to fill tables with sample
// exports.sampleData = function(done) {
//
// }