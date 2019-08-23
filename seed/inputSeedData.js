require('dotenv').config();
const seedData = require('./seedData');
const knex = require('knex');
const {DB_URL} = require('../src/config');

const db = knex({
    client: 'pg',
    connection: DB_URL
})

console.log('db', DB_URL)

const seedDatabase = new Promise(function(resolve, reject) {
    return db.raw(
        `TRUNCATE
            employees
            RESTART IDENTITY CASCADE`)
            .then(() => {
                return db
                .into('employees')
                .insert(employees)
                .then(() => {
                    db.destroy();
                    resolve();
                })
            })
            .catch(error => {
                db.destroy()
                reject(error);
            })
})

seedDatabase.then(() => {
    console.log(`Data seeded at ${DB_URL}`)
})
.catch(error => {
    console.log(error)
});