const express = require('express');
const {serializeEmployee} = require('../utils/xss-functions');
const {timeFunctions} = require('../utils/time-functions');
const allEmployeesService = require('./all-employees-service');

const allEmployeesRouter = express.Router();

allEmployeesRouter
    .route('')
    .get((req, res, next) => {
        const db = req.app.get('db');
        //Returns all ACTIVE users information
            allEmployeesService.getAllEmployees(db)
            .then(allEmployees => {
                
                //Converts datetime to MM/DD/YYYY for all employees
                allEmployees.forEach(employee => timeFunctions.convertEmployeeDatesToMMDDYYYY(employee));

                res.status(200).json(
                    allEmployees.map(employee => serializeEmployee(employee))
                )
            })
            .catch(error => {
                next(error);
            })
    })

module.exports = allEmployeesRouter;