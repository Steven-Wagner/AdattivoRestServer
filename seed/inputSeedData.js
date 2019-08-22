require('dotenv').config();
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
        .catch(error => {
            console.log('seed', error);
        })
}

function cleanTables(db) {
    return db.raw(
    `TRUNCATE
        employees
        RESTART IDENTITY CASCADE`)
        .catch(error => {
            throw(error);
        })

}

cleanTables(db)
.then(() => {
    console.log('getting here')
    return seedEmployees(db, seedData)
    .then(() => {
        console.log(`Data has been seeded at ${DB_URL}`);
    })
})