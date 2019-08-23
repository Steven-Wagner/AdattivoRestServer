# Adattivo RESTful Server Coding Challenge
## BY: Steven Wagner

## Set Up
1. Clone this repository to your local machine `git clone THIS-PROJECTS-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`

## Setting Up The Databases and .env File

1. Create 2 postgreSQL databases:
* One for test enviroment
* One for a mock production/staging enviroment

More information can be viewed here [postgreSQL Documentation](https://www.postgresql.org/docs/current/app-createdb.html)

2. Rename the `example.env` file with `mv example.env .env`

3. Add values to `.env` file. Replace all bracketed code with appropriate values, utilizing the 2 databases you created:
```
PORT=8000
TEST_DB_URL=[url to your test database e.g."postgresql://user:password@localhost/databaseName"]
DB_URL=[url to your staging/production database e.g."postgresql://user:password@localhost/databaseName"]

DELETE_EMPLOYEE_PASSWORD=password

MIGRATION_DB_HOST=localhost
MIGRATION_DB_PORT=5432
MIGRATION_DB_NAME=[name of test database]
MIGRATION_DB_USER=[user who has database privilges for the test database]
MIGRATION_DB_PASS=[users password]

PROD_MIGRATION_DB_HOST=localhost
PROD_MIGRATION_DB_PORT=5432
PROD_MIGRATION_DB_NAME=[name of production database]
PROD_MIGRATION_DB_USER=[user who has database privileges for the production database]
PROD_MIGRATION_DB_PASS=[users password]
```
For the sake of simplicity, DELETE_EMPLOYEE_PASSWORD is defaulted to `password`, but can be changed to any value. Just make sure that the `DELETE /api/employee/employee_id` API request has the correct value in the Authorization header.

4. Run `npm run init-databases`. This script will migrate the databases and seed it with intial data

5. `npm start` will start the production API and endpoints can be called with a base URL that will most likely be `http://localhost:8000`

## Scripts

Start the application `npm start`

Run the tests `npm test`

Start nodemon for the application `npm run dev`

Migrate test database `npm run migrate`

Migrate production database `npm run migrate-production`

Reset seed data in production database `npm run seed-data` This script will not migrate the database. Run `npm run init-databases` to migrate and seed data.

To migrate test and production database, and seed production database `npm run init-databases`

## Using The API Endpoints

### GET all employees
Endpoint: `http://localhost:8000/api/all-employees/`

Returns all ACTIVE employees.

Returns Ex:
```
[
    {
        "id": 1,
        "firstname": "Larry",
        "lastname": "Fine",
        "middleinitial": "A",
        "dateofbirth": "01/01/1925",
        "dateofemployment": "03/16/1969"
    },
    {
        "id": 2,
        "firstname": "Curly",
        "lastname": "Howard",
        "middleinitial": "B",
        "dateofbirth": "06/01/1925",
        "dateofemployment": "07/03/1947"
    }
]
```

### GET employee by ID
Endpoint: `http://localhost:8000/api/employee/:employee_id`

employee_id param is the ID of the employee to GET

Returns a single employee by a unique ID.

Returns Ex:
```
{
    "id": 1,
    "firstname": "Larry",
    "lastname": "Fine",
    "middleinitial": "A",
    "dateofbirth": "01/01/1925",
    "dateofemployment": "03/16/1969"
}
```

### POST new employee
Endpoint: `http://localhost:8000/api/employee/`

Adds a new employee.

Headers:
* Content-Type: application/json

Body:
```
{
    "firstname": [Required][Must be less than 51 characters in length][API will auto capitalize],
    "lastname": [Required][Must be less than 51 characters in length][API will auto capitalize],
    "middleinitial": [Optinal][Must only be a letter A-Z|a-z or undefined, Must be 1 character in length][API will auto capitalize],
    "dateofemployment": [Required][Must be in MM/DD/YYYY format],
    "dateofbirth": [Optinal][Must be in MM/DD/YYYY format],
}
```

Returns Ex:
```
{
    "id": 7
}
```
Returns the id of the new employee

### PATCH new employee
Endpoint: `http://localhost:8000/api/employee/:employee_id`

employee_id param is the ID of the employee to PATCH

Updates an existing employee. Must include at least one valid field in the body

Headers:
* Content-Type: application/json

Body:
```
May include one or more of the following feilds:
{
    "firstname":[Must be less than 51 characters in length][API will auto capitalize],
    "lastname":[Must be less than 51 characters in length][API will auto capitalize],
    "middleinitial":[Must only be a letter A-Z|a-z, Must be 1 character in length][API will auto capitalize],
    "dateofemployment":[Must be in MM/DD/YYYY format],
    "dateofbirth":[Must be in MM/DD/YYYY format],
    "status":[Must be 'ACTIVE']
}
```

Returns Ex:
```
Returns 204 No Content
```

### DELETE new employee
Endpoint: `http://localhost:8000/api/employee/:employee_id`

employee_id param is the ID of the employee to DELETE

Deletes an employee by ID.

Headers:
* Authorization: password [Must have correct password. See DELETE_EMPLOYEE_PASSWORD variable in .env file]

Returns Ex:
```
Returns 204 No Content
```

## Technologies Used

Node.js
Express.js
postgreSQL
knex
postgrator
Mocha
Chai
moment.js
xss
