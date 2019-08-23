function requireAuth(req, res, next) {
    //get the password from the Authorization header
    const submittedPassword = req.get('Authorization') || '';
    
    //If supplied password != the password stored in the .env file return 401
    if (submittedPassword !== process.env.DELETE_EMPLOYEE_PASSWORD) {
        res.status(401).json({
            message: 'Unauthorized request'
        })
    }
    else {
        next();
    }
}

module.exports = {requireAuth};