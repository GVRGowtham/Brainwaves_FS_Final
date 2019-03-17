const knex = require('knex');
// const getServiceByNameOrTag = require('./utils/cf-env');
// const assert = require('assert');

// let service = getServiceByNameOrTag([/user-provided/])
// if (!service) throw new Error('predix-mobile service binding not detected');

// let uri = service.credentials.uri;
// assert(uri, 'service.credentials.uri is required for binding');

const db = knex({
    client: 'pg',
    connection: "postgres://postgres:postgres@localhost:5432/brainwave_fs_final_newdata",
    searchPath: ['knex', 'public'],
});

//Create SOCGEN table
db.schema.dropTableIfExists('socgen_data').then(() => {
    console.log('Dropped socgen_data table');

    // Initialize your table
    return db.schema.createTable('socgen_data', table => {
        table.increments('id').primary();
        table.string('20');
        table.string('22A');
        table.string('22C');
        table.string('24D');
        table.date('30T');
        table.date('30V');
        table.string('32B');
        table.string('33B');
        table.string('36');
        table.string('52A');
        table.string('53A');
        table.string('56A');
        table.string('56D');
        table.string('57A');
        table.string('57D');
        table.string('58A');
        table.string('58D');
        table.string('77H');
        table.string('82A');
        table.string('87A');
        table.string('match_status');
        table.string('match_20');
    });
}).then(() => {
    console.log("Created socgen_data");
});

//Create Client table
db.schema.dropTableIfExists('other_data').then(() => {
    console.log('Dropped other_data table');

    // Initialize your table
    return db.schema.createTable('other_data', table => {
        table.increments('id').primary();
        table.string('20');
        table.string('22A');
        table.string('22C');
        table.string('24D');
        table.date('30T');
        table.date('30V');
        table.string('32B');
        table.string('33B');
        table.string('36');
        table.string('52A');
        table.string('53A');
        table.string('56A');
        table.string('56D');
        table.string('57A');
        table.string('57D');
        table.string('58A');
        table.string('58D');
        table.string('77H');
        table.string('82A');
        table.string('87A');
        table.string('match_status');
        table.string('match_20');
    });
}).then(() => {
    console.log("Created other_data");
});