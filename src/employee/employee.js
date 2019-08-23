const express = require('express');
const employeeService = require('./employee-service');
const {serializeEmployee} = require('../utils/xss-functions');
const {timeFunctions} = require('../utils/time-functions');
const {requireAuth} = require('../middleware/require-auth');

const jsonBodyParser = express.json();

const employeeRouter = express.Router();


//-----GET all info about a single 'ACTIVE' employee by ID-----

employeeRouter
    .route('/:employee_id')
    .get((req, res, next) => {
        //ID is passed from param; employee_id
        const db = req.app.get('db');
        const employee_id = req.params.employee_id;

        //Get the employee by id from DB. Will return an employee or if no employee exists will return undefined
        employeeService.getEmployeeById(employee_id, db)
        .then(employee => {
            //
            errorMessages = employeeService.validateGetEmployee(employee)
            if (errorMessages.length > 0) {
                //If there are errors. Returns a message that contains an array of all errors.
                res.status(400).json({
                    message: errorMessages
                });
            }
            else {
                timeFunctions.convertEmployeeDatesToMMDDYYYY(employee);
                res.status(200).json(
                    serializeEmployee(employee)
                )
            }
        })
        .catch(error => {
            next(error);
        })
    })


//-----PATCH an employee by ID-----

    .patch(jsonBodyParser, (req, res, next) => {
        //ID is passed from param; employee_id
        const db = req.app.get('db');
        const {firstname, lastname, dateofemployment, dateofbirth, status, middleinitial} = req.body;
        const updatedEmployee = {firstname, lastname, dateofemployment, dateofbirth, status, middleinitial};
        const employeeId = req.params.employee_id;

        //Remove any trailing white space of inputs
        employeeService.trimEmployeeFields(updatedEmployee);

        return employeeService.validateUpdateEmployee(employeeId, updatedEmployee, db)
        .then(errorMessages => {
            if (errorMessages.length > 0) {
                //If there are errors. Returns a message that contains an array of all errors.
                res.status(400).json({
                    message: errorMessages
                })
            }
            else {
                //Update the existing employee
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


//-----POST a new user-----

employeeRouter
    .route('')
    .post(jsonBodyParser, (req, res, next) => {
        //POST a new user
        const db = req.app.get('db');
        const {firstname, lastname, dateofemployment, dateofbirth, status, middleinitial} = req.body;
        const newEmployee = {firstname, lastname, dateofemployment, dateofbirth, status, middleinitial};

        //Trim any trailing white space in inputs
        employeeService.trimEmployeeFields(newEmployee);

        employeeService.validateNewEmployee(newEmployee, db)
        .then(errorMessages => {
            if (errorMessages.length > 0) {
                //If there are errors. Returns a message that contains an array of all errors.
                return res.status(400).json({
                    message: errorMessages
                })
            }
            else {
                //Insert the new employee
                employeeService.postNewEmployee(newEmployee, db)
                .then(newEmployeeId => {
                    res.status(201).json(
                        //Responds with the new employees id in format {id: theNewId}
                        newEmployeeId
                    )
                })
            }
        })
        .catch(error => {
            next(error);
        })
    })


//-----DELETE an existsing user by ID-----

employeeRouter
    .route('/:employee_id')
    .all(requireAuth)
    .delete((req, res, next) => { 
        //ID is passed from param; employee_id
        const db = req.app.get('db');
        employeeId = req.params.employee_id;

        employeeService.validateEmployeeDelete(employeeId, db)
        .then(errorMessages => {
            if (errorMessages.length > 0) {
                //If there are errors. Returns a message that contains an array of all errors.
                return res.status(400).json({
                    message: errorMessages
                })
            }
            //Deletes the employee from the database
            employeeService.deleteEmployee(employeeId, db)
            .then(id => {
                res.status(204).json()
            })
        })
        .catch(error => {
            next(error);
        })
    })

module.exports = employeeRouter;