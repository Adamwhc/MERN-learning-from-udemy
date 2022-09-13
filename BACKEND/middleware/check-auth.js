const HttpEorror = require("../models/http-error");
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        // console.log(token);
        if (!token) {
            throw new Error('Authentication failed!');
        }
        const decodedToken = jwt.verify(token, 'supersecret_dont_share');
        // console.log(1, decodedToken.userId);
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        const error = new HttpEorror(
            'Authentication failed',
            403
        );
        return next(error);
    }
};