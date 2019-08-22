function requireAuth(req, res, next) {
    const submittedPassword = req.get('Authorization') || '';
        
    if (submittedPassword !== process.env.PASSWORD) {
        res.status(401).json({
            message: 'Unauthorized request'
        })
    }
    else {
        next();
    }
}

module.exports = {requireAuth};