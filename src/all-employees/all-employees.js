const express = require('express');
const allEmployeesService = require('./all-employees-service');

const allEmployeesRouter = express.Router();

allEmployeesRouter
    .route('')
    .get((req, res, next) => {
        const db = req.app.get('db');
        //Returns all ACTIVE users information
            allEmployeesService.getAllEmployees(db)
            .then(allEmployees => {
                res.status(200).json(
                    allEmployees
                )
            })
            .catch(error => {
                next(error);
            })
    })

module.exports = allEmployeesRouter;