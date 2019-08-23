const xss = require('xss');

function serializeEmployee(employee) {
    return {
        id: employee.id,
        firstname: xss(employee.firstname),
        lastname: xss(employee.lastname),
        middleinitial: xss(employee.middleinitial),
        dateofbirth: xss(employee.dateofbirth),
        dateofemployment: xss(employee.dateofemployment),
        status: employee.stat
    }
}

module.exports = {
    serializeEmployee
}