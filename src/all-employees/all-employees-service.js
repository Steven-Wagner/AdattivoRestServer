const allEmployeesService = {
    getAllEmployees(db) {
        //Returns all employees that have ACTIVE status
        return db
            .from('employees')
            .where('status', 'ACTIVE')
            .select('*')
    }
}

module.exports = allEmployeesService;