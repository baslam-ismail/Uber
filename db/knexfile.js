// db/knexfile.js - CommonJS
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

/** @type {{[k:string]: import('knex').Knex.Config}} */
const config = {
    development: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            // chemins absolus pour éviter les ambiguïtés (knexfile placé dans /db)
            directory: path.join(__dirname, '..', 'migrations'),
            extension: 'ts'
        },
        seeds: {
            directory: path.join(__dirname, '..', 'seeds'),
            extension: 'ts'
        }
    },

};

module.exports = config;
