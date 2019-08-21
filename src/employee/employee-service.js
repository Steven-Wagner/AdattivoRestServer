const moment = require('moment');

const employeeService = {
    validateGetEmployee(employee, res) {
        let errorMessages = [];
        const doesNotExist = this.validateEmployeeExists(employee, res);
        if (doesNotExist) {
            errorMessages.push(doesNotExist)
        }

        return errorMessages;
    },

    validateEmployeeExists(employee) {
        if (!employee) {
            return `Employee does not exists`
        }
        if (employee.status === 'INACTIVE') {
            return `Employee is INACTIVE`
        }
        else {
            return;
        }
    },

    getEmployeeById(employee_id, db) {
        return db
            .from('employees')
            .where('id', employee_id)
            .select('*')
            .first()
    },

    validateNewEmployee(employee) {
        let errorMessages = [];

        errorMessages = this.validateRequiredFields(employee, errorMessages);
        
        errorMessages = this.validateNamesAreNotTooLong(employee, errorMessages);

        errorMessages = this.validateDatesAreValid(employee, errorMessages);

        errorMessages = this.validateMiddleInitial(employee, errorMessages);

        return errorMessages;
    },
    validateMiddleInitial(employee, errorMessages) {
        if (employee.middleinitial.length > 1) {
            errorMessages.push('Middle Initial must be one character in length');
        }
        //initial must be a letter
        if (!employee.middleinitial.match(/[A-Z|a-z]/i)) {
            errorMessages.push('Middle Initial must be a letter from A-Z')
        }
        return errorMessages;
    },
    validateDatesAreValid(employee, errorMessages) {
        const dateKeysToCheck = ['dateofemployment', 'dateofbirth'];
        
        dateKeysToCheck.forEach(date => {
            if (!moment(employee[date], "MM/DD/YYYY", true).isValid()) {
                errorMessages.push(`${date} is invalid make sure it is in MM/DD/YYYY format`)
            }
        })
        return errorMessages;
    },
    validateNamesAreNotTooLong(employee, errorMessages) {
        if (employee.firstname && employee.lastname) {
            if (employee.firstname.length > 50) {
                errorMessages.push('First Name must be less than 50 characters')
            }
            if (employee.lastname.length > 50) {
                errorMessages.push('Last Name must be less than 50 characters')
            }
        }
        return errorMessages;
    },

    validateRequiredFields(employee, errorMessages) {
        const requiredFields = {'firstname': 'First Name', 'lastname': 'Last Name', 'dateofemployment': 'Date of Employment'};

        for (let [key, value] of Object.entries(requiredFields)) {
            if (!employee[key]) {
                errorMessages.push(`${value} is required`)
            }
        }
        return errorMessages;
    },
    postNewEmployee(employee, db) {
        //make sure that middleinitial is capitalized
        employee.middleinitial = employee.middleinitial.toUpperCase();

        //insert new employee into employees table
        return db
            .from('employees')
            .insert(
                employee
            )
            .returning('id')
    }
}

module.exports = employeeService;