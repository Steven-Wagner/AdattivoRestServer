const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('employee Endpoints', function() {
    let db;

    const testEmployees = helpers.makeEmployeesArray();
    const testEmployee = testEmployees[0];
    const newEmployee = helpers.makeNewEmployee();

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

    beforeEach('insert employees', async function () {
        return await helpers.seedEmployees(
            db,
            testEmployees
        );
    });

    describe('GET /api/employee/employee_id', () => {
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

    describe('POST /api/employee/', () => {
        context('happy path', () => {
            const newId = testEmployees.length + 1;

            it('Responds 200 and new employees is added to database with new id', () => {
                return request(app)
                .post(`/api/employee/`)
                .send(newEmployee)
                .expect(200)
                .then(res => {
                    return db
                        .from('employees')
                        .where('id', newId)
                        .select('id')
                        .first()
                        .then(res => {
                            expect(res.id).to.eql(newId)
                        })
                })

            })
            it('Responds 200 and new employees default status is ACTIVE', () => {
                return request(app)
                .post(`/api/employee/`)
                .send(newEmployee)
                .expect(200)
                .then(res => {
                    return db
                        .from('employees')
                        .where('id', newId)
                        .select('status')
                        .first()
                        .then(res => {
                            expect(res.status).to.eql('ACTIVE');
                        })
                })
            })

            it('Responds 200 and middleinitial is capitalized', () => {
                const lowerCaseInitialEmployee = Object.assign({}, newEmployee);
                const newInitial = 'a';
                lowerCaseInitialEmployee.middleinitial = newInitial;
                const newEmployeeId = testEmployees.length+1;

                return request(app)
                .post(`/api/employee/`)
                .send(lowerCaseInitialEmployee)
                .expect(200)
                .then(res => {
                    return db
                        .from('employees')
                        .where('id', newEmployeeId)
                        .select('middleinitial')
                        .first()
                        .then(res => {
                            expect(res.middleinitial).to.eql(newInitial.toUpperCase())
                        })
                })
            })
        })

        context('Required fields missing', () => {
            const requiredFields = {'firstname': 'First Name', 'lastname': 'Last Name', 'dateofemployment': 'Date of Employment'};

            for (let [key, value] of Object.entries(requiredFields)) {
                it(`Responds 400 when ${key} is missing from body`, () => {
                    const missingFieldsEmployee = Object.assign({}, newEmployee);

                    delete missingFieldsEmployee[key];

                    return request(app)
                    .post(`/api/employee/`)
                    .send(missingFieldsEmployee)
                    .expect(400)
                    .then(res => {
                        expect(res.body.message[0]).to.eql(`${value} is required`);
                    })
                })
                it(`Responds 400 when ${key} is undefined`, () => {
                    const missingFieldsEmployee = Object.assign({}, newEmployee);

                    missingFieldsEmployee[key] = '';

                    return request(app)
                    .post(`/api/employee/`)
                    .send(missingFieldsEmployee)
                    .expect(400)
                    .then(res => {
                        expect(res.body.message[0]).to.eql(`${value} is required`);
                    })
                })
            }
        })
        context('Date format in body is invalid', () => {
            const dateFields = ['dateofbirth', 'dateofemployment'];
            dateFields.forEach(dateKey => {
                it('Reponds 400 when date is in an invalid format', () => {
                    const badDateEmployee = Object.assign({}, newEmployee);
    
                    badDateEmployee[dateKey] = '13/01/2000';

                    return request(app)
                    .post(`/api/employee/`)
                    .send(badDateEmployee)
                    .expect(400)
                    .then(res => {
                        expect(res.body.message[0]).to.eql(`${dateKey} is invalid make sure it is in MM/DD/YYYY format`);
                    })
                })
            })
        })

        context('Name fields are over 50 chracters', () => {
            const nameFields = {'firstname':'First Name', 'lastname': 'Last Name'};

            for (let [key, value] of Object.entries(nameFields)) {
                it(`Reponds 400 when ${key} is longer that 50 characters`, () => {
                    const badNameEmployee = Object.assign({}, newEmployee);
                    badNameEmployee[key] = helpers.makeRandomString(51);

                    return request(app)
                    .post(`/api/employee/`)
                    .send(badNameEmployee)
                    .expect(400)
                    .then(res => {
                        expect(res.body.message[0]).to.eql(`${value} must be less than 50 characters`);
                    })
                })
            }
        })
        context('Middle initial validates correctly', () => {
            it('Responds 400 when middle initial is not a letter from a-z', () => {
                const badInitialEmployee = Object.assign({}, newEmployee);
                badInitialEmployee.middleinitial = '2';

                return request(app)
                .post(`/api/employee/`)
                .send(badInitialEmployee)
                .expect(400)
                .then(res => {
                    expect(res.body.message[0]).to.eql('Middle Initial must be a letter from A-Z');
                })
            })
            it('Responds 400 when middle initials length is > 1', () => {
                const badInitialEmployee = Object.assign({}, newEmployee);
                badInitialEmployee.middleinitial = 'ab';

                return request(app)
                .post(`/api/employee/`)
                .send(badInitialEmployee)
                .expect(400)
                .then(res => {
                    expect(res.body.message[0]).to.eql('Middle Initial must be one character in length');
                })
            })
        })
        context('Responds with multiple error messages', () => {
            it('Responds with 400 and multiple error messages when all required fields are missing', () => {
                const noRequiredFieldsEmployee = Object.assign({}, newEmployee);
                noRequiredFieldsEmployee.firstname = '';
                noRequiredFieldsEmployee.lastname = '';
                noRequiredFieldsEmployee.dateofemployment = '';

                return request(app)
                .post(`/api/employee/`)
                .send(noRequiredFieldsEmployee)
                .expect(400)
                .then(res => {
                    expect(res.body.message).to.have.length(3);
                })
            })
        })
    })

    describe('PATCH /api/employee/:employee_id', () => {
        context('happy path', () => {
            const columnsToChange = {'firstname': 'First Name', 'lastname': 'Last Name', 'dateofemployment': 'Date of Employment', 'dateofbirth': 'Date of Birth', 'middleinitial': 'Middle Initial'};
            for (let [key, value] of Object.entries(columnsToChange)) {
                it(`Responds 204 and employee's ${key} is changed`, () => {
                    const employeeId = testEmployee.id;
                    const updatedEmployee = helpers.makeUpdatedEmployeeData();

                    const columnToUpdate = {};
                    columnToUpdate[key] = updatedEmployee[key];

                    return request(app)
                    .patch(`/api/employee/${employeeId}/`)
                    .send(columnToUpdate)
                    .expect(204)
                    .then(() => {
                        return db
                            .from('employees')
                            .where('id', employeeId)
                            .select(key)
                            .first()
                            .then(res => {
                                if (key === 'dateofbirth' || key === 'dateofemployment') {
                                    expect(new Date(res[key])).to.eql(new Date(columnToUpdate[key]));
                                }
                                else {
                                    expect(res[key]).to.eql(columnToUpdate[key])
                                }
                            })
                    })
                })
            }
        })
        context('Validate dates', () => {
            const dateColumns = ['dateofemployment', 'dateofbirth'];

            for (let date of dateColumns) {
                it(`Responds 400 when ${date} is invalid`, () => {
                    const employeeId = testEmployee.id;

                    const columnToUpdate = {};
                    columnToUpdate[date] = '13/32/1234';

                    return request(app)
                        .patch(`/api/employee/${employeeId}/`)
                        .send(columnToUpdate)
                        .expect(400)
                        .then((res) => {
                            expect(res.body.message[0]).to.eql(`${date} is invalid make sure it is in MM/DD/YYYY format`)
                        })
                })
            }
        })
        context('Validate names', () => {
            const nameColumns = {'firstname': 'First Name', 'lastname': 'Last Name'};

            for (let [columnName, prettyName] of Object.entries(nameColumns)) {
                it(`Responds 400 when ${prettyName} is longer than 50 characters`, () => {
                    const employeeId = testEmployee.id;

                    const columnToUpdate = {};
                    columnToUpdate[columnName] = helpers.makeRandomString(51);

                    return request(app)
                        .patch(`/api/employee/${employeeId}/`)
                        .send(columnToUpdate)
                        .expect(400)
                        .then((res) => {
                            expect(res.body.message[0]).to.eql(`${prettyName} must be less than 50 characters`)
                        })
                })
            }
        })
        context('Validate middle initial', () => {
            it(`Responds 400 when middleinitial is over 1 character in length`, () => {
                const employeeId = testEmployee.id;

                const columnToUpdate = {middleinitial: 'ab'};

                return request(app)
                    .patch(`/api/employee/${employeeId}/`)
                    .send(columnToUpdate)
                    .expect(400)
                    .then((res) => {
                        expect(res.body.message[0]).to.eql('Middle Initial must be one character in length')
                    })
        
            })
            it(`Responds 400 when middleinitial is not a letter`, () => {
                const employeeId = testEmployee.id;

                const columnToUpdate = {middleinitial: '3'};

                return request(app)
                    .patch(`/api/employee/${employeeId}/`)
                    .send(columnToUpdate)
                    .expect(400)
                    .then((res) => {
                        expect(res.body.message[0]).to.eql('Middle Initial must be a letter from A-Z')
                    })
            })
        })
        it('Responds 400 when there are no fields in the body', () => {
            const employeeId = testEmployee.id;

            return request(app)
                .patch(`/api/employee/${employeeId}/`)
                .send('')
                .expect(400)
                .then((res) => {
                    expect(res.body.message[0]).to.eql('Update is missing any content')
                })
        })
        it('Responds 400 when user attempts to update employee to INACTIVE', () => {
            const employeeId = testEmployee.id;
            const statusColumn = {status: 'INACTIVE'};

            return request(app)
                .patch(`/api/employee/${employeeId}/`)
                .send(statusColumn)
                .expect(400)
                .then((res) => {
                    expect(res.body.message[0]).to.eql(`Can not update employee to INACTIVE. Try to delete employee instead`)
                })
        })
    })

    describe('DELETE /api/employee/:employee_id', () => {
        context('Happy path', () => {
            it('Responds 204 and users status is set to INACTIVE', () => {
                const employeeToDelete = testEmployee;
                const employeeId = employeeToDelete.id;

                return request(app)
                .delete(`/api/employee/${employeeId}/`)
                .set('Authorization', process.env.PASSWORD)
                .expect(204)
                .then((res) => {
                    return db
                        .from('employees')
                        .where('id', employeeId)
                        .select('status')
                        .first()
                        .then(res => {
                            expect(res.status).to.eql('INACTIVE')
                        })
                })
            })
        })
        context('Validate delete', () => {
            it('Responds 401 when wrong password is in authorization header', () => {
                const wrongPassword = 'wrongpassword';
                const employeeId = testEmployee.id;

                return request(app)
                .delete(`/api/employee/${employeeId}/`)
                .set('Authorization', wrongPassword)
                .expect(401)
                .then(res => {
                    expect(res.body.message).to.eql('Unauthorized request');
                })
            })
            it('Responds 400 when employee is already INACTIVE', () => {
                const employeeDeleted = testEmployees.find(employee => {
                    return employee.status === 'INACTIVE';
                })
                const employeeId = employeeDeleted.id;

                return request(app)
                .delete(`/api/employee/${employeeId}/`)
                .set('Authorization', process.env.PASSWORD)
                .expect(400)
                .then(res => {
                    expect(res.body.message[0]).to.eql('Employee is already deleted');
                })
            })
        })
    })
})