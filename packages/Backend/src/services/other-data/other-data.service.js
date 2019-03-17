const createService = require('feathers-knex');
const createModel = require('../../models/postgres.model');
const hooks = require('./other-data.hooks');

module.exports = function(app) {
    const Model = createModel(app);

    const options = {
        id: 'id',
        name: 'other_data',
        Model
    };

    // Initialize our service with any options it requires
    app.use('/other-data', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('other-data');

    service.hooks(hooks);
};