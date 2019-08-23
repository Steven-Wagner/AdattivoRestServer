const app = require('./app')
const knex = require('knex');
const {PORT, DB_URL} = require('./config');

//This will configure knex to our production DB
const db = knex({
    client: 'pg',
    connection: DB_URL
})

//Allows DB to be called quickly from other files
app.set('db', db);

app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`)
})