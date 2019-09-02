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
        {
            id: 4,
            firstname: 'FirstNameFour',
            middleinitial: 'D',
            lastname: 'LastNameFour',
            dateofemployment: '12/12/2018',
            dateofbirth: '10/15/2010',
            status: 'ACTIVE'
        },
    ]
}

function makeNewEmployee() {
    return {
        firstname: 'NewFirstName',
        middleinitial: 'D',
        lastname: 'NewLastName',
        dateofbirth: '04/04/2004',
        dateofemployment: '05/05/2005',
    }
}

function makeUpdatedEmployeeData() {
    return {
        firstname: 'UpdatedFirstName',
        middleinitial: 'U',
        lastname: 'UpdatedLastName',
        dateofbirth: '12/12/2012',
        dateofemployment: '12/25/2005',
    }
}

function cleanTables(db) {
    return db.raw(
    `TRUNCATE
        employees
        RESTART IDENTITY CASCADE`)
}

function seedEmployees(db, employees) {
    //Removes IDs before insertion to avoid automatic ID increment issues that can occur
    const preppedEmployees = employees.map(employee => {
        const employeeInfo = Object.assign({}, employee);
        delete employeeInfo.id;
        return employeeInfo;
    })
    return db
        .into('employees')
        .insert(preppedEmployees)
}

function makeRandomString(length) {
    var text = "";

    var charset = "abcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < length; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
}

function unCapitalizeFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.substring(1);
}

module.exports = {
    makeEmployeesArray,
    cleanTables,
    seedEmployees,
    makeNewEmployee,
    makeRandomString,
    makeUpdatedEmployeeData,
    capitalizeFirstLetter,
    unCapitalizeFirstLetter
}