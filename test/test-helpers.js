function makeEmployeesArray() {
    return [
        {
            id: 1,
            firstname: 'FirstNameOne',
            middleinitial: 'A',
            lastname: 'LastNameOne',
            dateofemployment: '01/01/2019',
            dateofbirth: '01/01/2010',
            status: 'ACTIVE'
        },
        {
            id: 2,
            firstname: 'FirstNameTwo',
            middleinitial: 'B',
            lastname: 'LastNameTwo',
            dateofemployment: '02/02/2019',
            dateofbirth: '02/02/2010',
            status: 'ACTIVE'
        },
        {
            id: 3,
            firstname: 'FirstNameThree',
            middleinitial: 'C',
            lastname: 'LastNameThree',
            dateofemployment: '03/03/2019',
            dateofbirth: '03/03/2010',
            status: 'INACTIVE'
        },
    ]
}

function makeNewEmployee() {
    return {
        firstname: 'newFirstName',
        middleinitial: 'D',
        lastname: 'newLastName',
        dateofbirth: '04/04/2004',
        dateofemployment: '05/05/2005',
    }
}

function cleanTables(db) {
    return db.raw(
    `TRUNCATE
        employees
        RESTART IDENTITY CASCADE`)
}

function seedEmployees(db, employees) {
    const preppedEmployees = employees.map(employee => {
        const employeeInfo = Object.assign({}, employee);
        delete employeeInfo.id;
        return employeeInfo;
    })
    return db
        .into('employees')
        .insert(preppedEmployees)
}

module.exports = {
    makeEmployeesArray,
    cleanTables,
    seedEmployees,
    makeNewEmployee
}