const express = require('express');
const employeeService = require('./employee-service');

const employeeRouter = express.Router();

employeeRouter
    .route('/:employee_id')
    .get((req, res, next) => {
        const db = req.app.get('db');
        const employee_id = req.params.employee_id;

        //Get employee by id. Will return an employee or undefined
        employeeService.getEmployeeById(employee_id, db)
        .then(employee => {
            const errorMessages = employeeService.validateGetEmployee(employee)
            if (errorMessages.length > 0) {
                res.status(400).json({
                    message: errorMessages
                });
            }
            else {
                res.status(200).json(
                    employee
                )
            }
        })
        .catch(error => {
            next(error);
        })
    })

module.exports = employeeRouter;