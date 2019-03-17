const knex = require('knex');
const assert = require('assert');

module.exports = function (app) {

    console.log('[DEBUG] postgres.model:', 'retrieving binding');

    const Model = new knex({
        client: 'pg',
        connection: "postgres://postgres:postgres@localhost:5432/brainwave_fs_final_newdata",
        searchPath: ['knex', 'public'],
    });

    return Model;
};
