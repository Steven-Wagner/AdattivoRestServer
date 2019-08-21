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
    }
}

module.exports = employeeService;