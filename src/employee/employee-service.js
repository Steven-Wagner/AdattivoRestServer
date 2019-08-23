const moment = require('moment');

const employeeService = {
    validateGetEmployee(employee) {
        let errorMessages = [];
        //Validates that the employees exists
        errorMessages = this.validateEmployeeExists(employee, errorMessages);

        return errorMessages;
    },

    validateEmployeeExists(employee, errorMessages) {
        if (!employee) {
            //If employee does not exist return error message
            errorMessages.push(`Employee does not exists`);
            return errorMessages;
        }
        if (employee.status === 'INACTIVE') {
            //If employee has already been deleted return error message
            errorMessages.push(`Employee is INACTIVE`);
            return errorMessages;
        }
        else {
            return errorMessages;
        }
    },

    async getEmployeeById(employee_id, db) {
        if (isNaN(employee_id)) {
            //If employee_id is not number return undefined
            return;
        }
        return db
            .from('employees')
            .where('id', employee_id)
            .select('*')
            .first()
    },

    async validateNewEmployee(employee, db) {
        let errorMessages = [];

        errorMessages = this.validateRequiredFields(employee, errorMessages);
        
        errorMessages = this.validateNamesAreNotTooLong(employee, errorMessages);

        //Validate the dates are in MM/DD/YYYY format
        errorMessages = this.validateDatesAreValid(employee, errorMessages);

        errorMessages = this.validateMiddleInitial(employee, errorMessages);

        if (errorMessages.length < 1) {
            //If no errors have already been thrown check if new employee is a duplicate of one that already exists
            errorMessages = await this.validateDuplicate(employee, errorMessages, db);
        }

        return errorMessages;
    },
    validateDuplicate(employee, errorMessages, db) {
        //If all fields match a user already in the database return an error message
        return db
            .from('employees')
            .where('firstname', employee.firstname)
            .andWhere('lastname', employee.lastname)
            .andWhere('dateofbirth', employee.dateofbirth)
            .andWhere('dateofemployment', employee.dateofemployment)
            .andWhere('middleinitial', employee.middleinitial)
            .first()
            .then(res => {
                if (res) {
                    errorMessages.push('Employee already exists');
                }
                return errorMessages;
            })

    },
    validateMiddleInitial(employee, errorMessages) {
        if (employee.middleinitial) {
            if (employee.middleinitial.length > 1) {
                errorMessages.push('Middle Initial must be one character in length');
            }
            //initial must be a letter or undefined
            if (!employee.middleinitial.match(/[A-Z|a-z| ]/i) && employee.middleinitial) {
                errorMessages.push('Middle Initial must be a letter from A-Z')
            }
        }
        return errorMessages;
    },
    validateDatesAreValid(employee, errorMessages) {
        const dateKeysToCheck = ['dateofemployment', 'dateofbirth'];
        
        dateKeysToCheck.forEach(date => {
            if (employee[date]) {
                //Date must be in MM/DD/YYYY format and must be a valid date
                if (!moment(employee[date], "MM/DD/YYYY", true).isValid()) {
                    errorMessages.push(`${date} is invalid make sure it is in MM/DD/YYYY format`)
                }
            }
        })
        return errorMessages;
    },
    validateNamesAreNotTooLong(employee, errorMessages) {
        //Names may not be longer than 50 characters
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
        if (employee.middleinitial) {
            employee.middleinitial = employee.middleinitial.toUpperCase();
        }

        //Make sure that first letter of first and last name is captalized
        this.capitalizeNames(employee);

        //insert new employee into employees table
        return db
            .from('employees')
            .insert(
                employee
            )
            .returning('id')
            .then(newIdArray => {
                return ({id: newIdArray[0]});
            })
    },
    capitalizeNames(employee) {
        if (employee.firstname) {
            employee.firstname = employee.firstname.charAt(0).toUpperCase() + employee.firstname.substring(1);
        }
        if (employee.lastname) {
            employee.lastname = employee.lastname.charAt(0).toUpperCase() + employee.lastname.substring(1);
        }  
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
        //Make sure that any updates names are capitalized
        this.capitalizeNames(employee);

        //Make sure that middleinitial is capitalized
        if (employee.middleinitial) {
            employee.middleinitial = employee.middleinitial.toUpperCase();
        }

        //Update employee. Undefined values will not update
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
    },
    trimEmployeeFields(employee) {
        //Remove all trailing white space from all employee feilds
        for ([key, value] of Object.entries(employee)) {
            if (value) {
                employee[key] = value.trim();
            }
        }
    }
}

module.exports = employeeService;