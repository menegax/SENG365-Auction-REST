const db = require('../controllers/db.server.controller');

module.exports = function(app) {
    app.route('/api/v1/reset')
        .post(db.reset);

    app.route('/api/v1/resample')
        .post(db.resample);
};