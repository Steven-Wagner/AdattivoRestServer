const allEmployeesService = {
    getAllEmployees(db) {
        return db
            .from('employees')
            .where('status', 'ACTIVE')
            .select('*')
    }
}

module.exports = allEmployeesService;