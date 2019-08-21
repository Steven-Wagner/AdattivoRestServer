const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('employee Endpoints', function() {
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

    describe('GET /api/employee/employee_id', () => {
        beforeEach('insert employees', async function () {
            return await helpers.seedEmployees(
                db,
                testEmployees
            );
        });

        context('Happy Path', () => {
            it('responds 200 and correct employee is returned', () => {
                expectedEmployee = testEmployee;
                const employeeId = expectedEmployee.id;
                
                return request(app)
                .get(`/api/employee/${employeeId}/`)
                .expect(200)
                .then(res => {
                    expect(res.body.id).to.eql(expectedEmployee.id);
                    expect(res.body.firstname).to.eql(expectedEmployee.firstname);
                    expect(res.body.lastname).to.eql(expectedEmployee.lastname);
                    expect(res.body.middleinitial).to.eql(expectedEmployee.middleinitial);
                    expect(new Date(res.body.dateofemployment)).to.eql(new Date(expectedEmployee.dateofemployment));
                    expect(new Date(res.body.dateofbirth)).to.eql(new Date(expectedEmployee.dateofbirth));
                })
            })
        })
        it('Responds 404 when employee_id param is not included', () => {
            return request(app)
                .get(`/api/employee/`)
                .expect(404)
        })
        
        it('Responds 400 and that id is INACTIVE', () => {
            const inactiveEmployee = testEmployees.find(employee => {
                return employee.status === 'INACTIVE';
            })

            return request(app)
                .get(`/api/employee/${inactiveEmployee.id}`)
                .expect(400)
                .then(res => {
                    expect(res.body.message.length).to.eql(1);
                    expect(res.body.message[0]).to.eql(`Employee is INACTIVE`);
                })
        })
        
        it('Responds 400 when empoyee_id does not exist', () => {
            const wrongId = testEmployees.length + 1;

            return request(app)
                .get(`/api/employee/${wrongId}`)
                .expect(400)
                .then(res => {
                    expect(res.body.message.length).to.eql(1);
                    expect(res.body.message[0]).to.eql(`Employee does not exists`);
                })
        })
    })
})