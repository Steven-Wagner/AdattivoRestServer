require('dotenv').config();
const seedData = require('./seedData');
const knex = require('knex');
const {DB_URL} = require('../src/config');

const db = knex({
    client: 'pg',
    connection: DB_URL
})

const seedDatabase = new Promise(function(resolve, reject) {
    return db.raw(
        `TRUNCATE
            employees
            RESTART IDENTITY CASCADE`)
            .then(() => {
                return db
                .into('employees')
                .insert(seedData)
                .then(() => {
                    resolve();
                })
            })
            .catch(error => {
                reject(error);
            })
})

seedDatabase.then(() => {
    //If seed in succesful end the DB connection and alert the user
    db.destroy();
    console.log(`Data seeded at ${DB_URL}`)
})
.catch(error => {
    //If seed was unsuccesful end DB connection and log the error to the console
    db.destroy();
    console.log(error.message)
});