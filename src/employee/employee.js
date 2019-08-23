const express = require('express');
const employeeService = require('./employee-service');
const {serializeEmployee} = require('../utils/xss-functions');
const {requireAuth} = require('../middleware/require-auth');

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
                    serializeEmployee(employee)
                )
            }
        })
        .catch(error => {
            next(error);
        })
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const db = req.app.get('db');
        const {firstname, lastname, dateofemployment, dateofbirth, status, middleinitial} = req.body;
        const updatedEmployee = {firstname, lastname, dateofemployment, dateofbirth, status, middleinitial};
        const employeeId = req.params.employee_id;

        employeeService.trimEmployeeFields(updatedEmployee);

        return employeeService.validateUpdateEmployee(employeeId, updatedEmployee, db)
        .then(errorMessages => {
            if (errorMessages.length > 0) {
                res.status(400).json({
                    message: errorMessages
                })
            }
            else {
                return employeeService.updateEmployee(employeeId, updatedEmployee, db)
                .then(() => {
                    res.status(204).json();
                })
            }
        })
        .catch(error => {
            next(error);
        })
    })

employeeRouter
    .route('/:employee_id')
    .all(requireAuth)
    .delete((req, res, next) => { 
        const db = req.app.get('db');
        employeeId = req.params.employee_id;

        employeeService.validateEmployeeDelete(employeeId, db)
        .then(errorMessages => {
            if (errorMessages.length > 0) {
                return res.status(400).json({
                    message: errorMessages
                })
            }
            employeeService.deleteEmployee(employeeId, db)
            .then(id => {
                res.status(204).json()
            })
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

        employeeService.trimEmployeeFields(newEmployee);

        employeeService.validateNewEmployee(newEmployee, db)
        .then(errorMessages => {
            if (errorMessages.length > 0) {
                return res.status(400).json({
                    message: errorMessages
                })
            }
            else {
                employeeService.postNewEmployee(newEmployee, db)
                .then(newEmployeeId => {
                    res.status(201).json(
                        newEmployeeId
                    )
                })
            }
        })
        .catch(error => {
            next(error);
        })
    })

module.exports = employeeRouter;