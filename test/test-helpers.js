function makeEmployeesArray() {
    return [
        {
            id: 1,
            FirstName: 'FirstNameOne',
            MiddleInitial: 'A',
            LastName: 'LastNameOne',
            DateOfEmployment: '01/01/2019',
            DateOfBirth: '01/01/2010',
            Status: 'ACTIVE'
        },
        {
            id: 2,
            FirstName: 'FirstNameTwo',
            MiddleInitial: 'B',
            LastName: 'LastNameTwo',
            DateOfEmployment: '02/02/2019',
            DateOfBirth: '02/02/2010',
            Status: 'ACTIVE'
        },
        {
            id: 3,
            FirstName: 'FirstNameThree',
            MiddleInitial: 'C',
            LastName: 'LastNameThree',
            DateOfEmployment: '03/03/2019',
            DateOfBirth: '03/03/2010',
            Status: 'INACTIVE'
        },
    ]
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
    })
    return db
        .into('employees')
        .insert(preppedEmployees)
}

module.exports = {
    makeEmployeesArray,
    cleanTables,
    seedEmployees
}