// eslint-disable-next-line no-unused-vars

const socgen_data = require('./socgen-data/socgen-data.service.js');
const other_data = require('./other-data/other-data.service.js');


module.exports = function (app) {
    app.configure(socgen_data);
    app.configure(other_data);
};
