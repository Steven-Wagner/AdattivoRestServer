function requireAuth(req, res, next) {
    const submittedPassword = req.get('Authorization') || '';

    if (submittedPassword !== process.env.PASSWORD) {
        res.status(401).json('Unauthorized request')
    }
}