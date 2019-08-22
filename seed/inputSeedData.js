const seedData = require('./seedData');
const knex = require('knex');
const {DB_URL} = require('../src/config');

const db = knex({
    client: 'pg',
    connection: DB_URL
})

function seedEmployees(db, employees) {
    return db
        .into('employees')
        .insert(employees)
}

function cleanTables(db) {
    return db.raw(
    `TRUNCATE
        employees
        RESTART IDENTITY CASCADE`)
}

cleanTables(db);

seedEmployees(db, seedData);