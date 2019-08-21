require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {NODE_ENV} = require('./config');
const allEmployeesRouter = require('./all-employees/all-employees');
const employeeRouter = require('./employee/employee');

const app = express();

const morganSetting = (NODE_ENV === 'production')
    ? 'tiny'
    : 'dev';

app.use(morgan(morganSetting));
app.use(cors());
app.use(helmet());

app.use('/api/all-employees/', allEmployeesRouter);
app.use('/api/employee/', employeeRouter);

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = {error: {message: 'server error'}}
    }
    else {
        response = {error}
    }
    console.log(error);
    res.status(500).json(response)
})

module.exports = app;