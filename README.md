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

2. Rename the `example.env` file with `mv example.env .env`

3. Add values to `.env` file. Replace all bracketed code with appropriate values, utilizing the 2 databases you created:
```
NODE_ENV=development
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
        "dateofbirth": "Thu Jan 01 1925 00:00:00 GMT-0700 (Mountain Standard Time)",
        "dateofemployment": "Sun Mar 16 1969 00:00:00 GMT-0700 (Mountain Daylight Time)"
    },
    {
        "id": 2,
        "firstname": "Curly",
        "lastname": "Howard",
        "middleinitial": "B",
        "dateofbirth": "Mon Jun 01 1925 00:00:00 GMT-0700 (Mountain Daylight Time)",
        "dateofemployment": "Thu Jul 03 1947 00:00:00 GMT-0700 (Mountain Daylight Time)"
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
    "dateofbirth": "Thu Jan 01 1925 00:00:00 GMT-0700 (Mountain Standard Time)",
    "dateofemployment": "Sun Mar 16 1969 00:00:00 GMT-0700 (Mountain Daylight Time)"
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
    "middleinitial": [Required][Must only be a letter A-Z|a-z, Must be 1 character in length][API will auto capitalize],
    "dateofemployment": [Required][Must be in MM/DD/YYYY format],
    "dateofbirth": [Optinal][Must be in MM/DD/YYYY format],
    "status": [Default="ACTIVE"][Values can only be "ACTIVE || "INACTIVE"]
}
```

Returns Ex:
```
{
    "id": 7
}
```

### PATCH new employee
Endpoint: `http://localhost:8000/api/employee/:employee_id`

employee_id param is the ID of the employee to PATCH

Updates an existing employee. Must include at least one valid field in the req.body

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
* Authorization: [DELETE_EMPLOYEE_PASSWORD][default=password]

Returns Ex:
```
Returns 204 No Content
```
