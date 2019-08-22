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
        if (employee.middleinitial) {
            if (employee.middleinitial.length > 1) {
                errorMessages.push('Middle Initial must be one character in length');
            }
            //initial must be a letter or undefined
            if (!employee.middleinitial.match(/[A-Z|a-z| ]/i)) {
                errorMessages.push('Middle Initial must be a letter from A-Z')
            }
        }
        return errorMessages;
    },
    validateDatesAreValid(employee, errorMessages) {
        const dateKeysToCheck = ['dateofemployment', 'dateofbirth'];
        
        dateKeysToCheck.forEach(date => {
            if (employee[date]) {
                if (!moment(employee[date], "MM/DD/YYYY", true).isValid()) {
                    errorMessages.push(`${date} is invalid make sure it is in MM/DD/YYYY format`)
                }
            }
        })
        return errorMessages;
    },
    validateNamesAreNotTooLong(employee, errorMessages) {
        if (employee.firstname) {
            if (employee.firstname.length > 50) {
                errorMessages.push('First Name must be less than 50 characters')
            }
        }
        if (employee.lastname) {
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
    },
    async validateUpdateEmployee(employeeId, updatedEmployee, db) {
        let errorMessages = [];

        if (!this.validateUpdateFieldsAreNotEmpty(updatedEmployee, errorMessages)) {
            errorMessages.push('Update is missing any content');
            return errorMessages;
        }

        const oldEmployee = await this.getEmployeeById(employeeId, db)
        
        if (!oldEmployee) {
            //If employee does not exists immediately return error 
            errorMessages.push('Employee id does not exists');
            return errorMessages;
        }
        if (updatedEmployee.status === 'INACTIVE') {
            //Can not update employee.status to INACTIVE
            errorMessages.push(`Can not update employee to INACTIVE. Try to delete employee instead`)
            return errorMessages;
        }

        errorMessages = this.validateNamesAreNotTooLong(updatedEmployee, errorMessages);
        errorMessages = this.validateMiddleInitial(updatedEmployee, errorMessages);
        errorMessages = this.validateDatesAreValid(updatedEmployee, errorMessages);

        return errorMessages;
    },
    validateUpdateFieldsAreNotEmpty(employee, errorMessages) {
        for (let value of Object.values(employee)) {
            //If there is any value in the employee object return true
            if (value) {
                return true;
            }
        }
        //If there are no values in employee object return false
        return false;
    },

    updateEmployee(employeeId, employee, db) {
        return db
            .from('employees')
            .where('id', employeeId)
            .update({
                firstname: employee.firstname,
                lastname: employee.lastname,
                middleinitial: employee.middleinitial,
                dateofemployment: employee.dateofemployment,
                dateofbirth: employee.dateofbirth,
                status: employee.status
            })
    },
    async validateEmployeeDelete(employeeId, db) {
        let errorMessages = [];

        const employee = await this.getEmployeeById(employeeId, db)
        if (!employee) {
            errorMessages.push('Employee does not exist')
            return errorMessages;
        }
        if (employee.status === 'INACTIVE') {
            errorMessages.push('Employee is already deleted');
            return errorMessages;
        }

        return errorMessages;
    },
    deleteEmployee(employeeId, db) {
        return db
            .from('employees')
            .where('id', employeeId)
            .update({
                status: 'INACTIVE'
            })
    }
}

module.exports = employeeService;