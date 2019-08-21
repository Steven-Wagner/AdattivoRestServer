const express = require('express');
const employeeService = require('./employee-service');

const jsonBodyParser = express.json();

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

employeeRouter
    .route('')
    .post(jsonBodyParser, (req, res, next) => {
        const db = req.app.get('db');
        const {firstname, lastname, dateofemployment, dateofbirth, status, middleinitial} = req.body;
        const newEmployee = {firstname, lastname, dateofemployment, dateofbirth, status, middleinitial};

        const errorMessages = employeeService.validateNewEmployee(newEmployee);

        if (errorMessages.length > 0) {
            return res.status(400).json({
                message: errorMessages
            })
        }
        else {
            employeeService.postNewEmployee(newEmployee, db)
            .then(newEmployeeId => {
                res.status(200).json(
                    newEmployeeId
                )
            })
            .catch(error => {
                next(error);
            })
        }

    })

module.exports = employeeRouter;