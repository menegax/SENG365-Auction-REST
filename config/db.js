const mysql = require('mysql');

let state = {
    pool: null
};

exports.connect = function(done) {
    state.pool = mysql.createPool({
        host: 'mysql3.csse.canterbury.ac.nz',
        user: 'jam357',
        password: '67842807',
        database: 'jam357'
    });
    done();
};

exports.get_pool = function() {
    return state.pool;
};