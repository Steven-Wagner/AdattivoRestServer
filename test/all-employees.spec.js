const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('all-employees Endpoints', function() {
    let db;

    const testEmployees = helpers.makeEmployeesArray();
    const testEmployee = testEmployees[0];

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
        return db
    });

    after('disconnect from db', () => db.destroy());

    before('cleanup', async function () { return await helpers.cleanTables(db)});

    afterEach('cleanup', async function () {return await helpers.cleanTables(db)});

    describe('GET /api/all-employees/', () => {
        beforeEach('insert employees', async function () {
            return await helpers.seedEmployees(
                db,
                testEmployees
            );
        });

        context('Happy Path', () => {
            it('responds 200 and all INACTIVE employees are not returned', () => {
                const expectedResult = testEmployees.filter(employee => {
                    return employee.status === 'ACTIVE';
                })
                
                return request(app)
                .get(`/api/all-employees/`)
                .expect(200)
                .then(res => {
                    expect(res.body.length).to.eql(expectedResult.length);
                    res.body.forEach(employee => {
                        expect(employee.status).to.eql('ACTIVE');
                    });
                })
            })
            context('Dates are returned in correct format', () => {
                const dateColumns = ['dateofbirth', 'dateofemployment'];
                dateColumns.forEach(dateColumn => {
                    it.only(`${dateColumn} is returned in correct format`, () => {
                        return request(app)
                        .get(`/api/all-employees/`)
                        .then(res => {
                            res.body.forEach(returnedEmployee => {
                                const expectedEmployee = testEmployees.find(expectedEmployee => {
                                    return expectedEmployee.id === returnedEmployee.id
                                })
                                expect(returnedEmployee[dateColumn]).to.eql(expectedEmployee[dateColumn])
                            })
                        });
                    })
                })
            })
        })
    })
})